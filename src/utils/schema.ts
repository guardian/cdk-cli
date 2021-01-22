import { DEFAULT_SCHEMA, Type } from "js-yaml";

// The following example shows how to implement custom tags with `js-yaml`
// https://github.com/nodeca/js-yaml/blob/master/examples/custom_types.js

enum Kinds {
  SCALAR = "scalar",
  SEQUENCE = "sequence",
  MAPPING = "mapping",
}

const cfnFunctions = {
  "!Base64": "Fn::Base64",
  "!Cidr": "Fn::Cidr",
  "!And": "Fn::And",
  "!Equals": "Fn::Equals",
  "!If": "Fn::If",
  "!Not": "Fn::Not",
  "!Or": "Fn::Or",
  "!FindInMap": "Fn::FindInMap",
  "!GetAtt": "Fn::GetAtt",
  "!GetAZs": "Fn::GetAZs",
  "!ImportValue": "Fn::ImportValue",
  "!Join": "Fn::Join",
  "!Select": "Fn::Select",
  "!Split": "Fn::Split",
  "!Sub": "Fn::Sub",
  "!Transform": "Fn::Transform",
  "!Ref": "Ref",
};

const functionKinds: Record<string, Kinds[]> = {
  "!Base64": [Kinds.SCALAR],
  "!Cidr": [Kinds.SEQUENCE],
  "!And": [Kinds.SEQUENCE],
  "!Equals": [Kinds.SEQUENCE],
  "!If": [Kinds.SEQUENCE],
  "!Not": [Kinds.SEQUENCE],
  "!Or": [Kinds.SEQUENCE],
  "!FindInMap": [Kinds.SEQUENCE],
  "!GetAtt": [Kinds.SEQUENCE, Kinds.SCALAR],
  "!GetAZs": [Kinds.SCALAR],
  "!ImportValue": [Kinds.MAPPING],
  "!Join": [Kinds.SEQUENCE],
  "!Select": [Kinds.SEQUENCE],
  "!Split": [Kinds.SEQUENCE],
  "!Sub": [Kinds.SCALAR, Kinds.SEQUENCE],
  "!Transform": [Kinds.MAPPING],
  "!Ref": [Kinds.SCALAR],
};

export const schema = DEFAULT_SCHEMA.extend(
  Object.entries(cfnFunctions).flatMap(([cfnKey, yamlKey]) => {
    return functionKinds[cfnKey].map(
      (kind: Kinds) =>
        new Type(cfnKey, {
          kind,
          construct: (data: unknown) => ({ [yamlKey]: data }),
        })
    );
  })
);
