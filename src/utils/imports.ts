export class Imports {
  imports: Record<string, { types: string[]; components: string[] }> = {
    "@guardian/cdk/lib/constructs/core": {
      types: [],
      components: ["GuStack"],
    },
    "@aws-cdk/core": {
      types: ["App", "StackProps"],
      components: [],
    },
  };

  addImport(lib: string, components: string[], type = false): void {
    if (!Object.keys(this.imports).includes(lib)) {
      const imports = type
        ? { types: components, components: [] }
        : { types: [], components };

      this.imports[lib] = imports;
      return;
    }

    const imports = this.imports[lib];
    if (type) {
      // Check if any of the new types are already imported as components
      // if so, don't add them as types too
      imports.types = [
        ...new Set(
          imports.types.concat(
            components.filter((c) => !imports.components.includes(c))
          )
        ),
      ];
    } else {
      // Check if any of the new components are already imported as types
      // if so, remove them from types before we add them to components
      imports.types = imports.types.filter((t) => !components.includes(t));
      imports.components = [...new Set(imports.components.concat(components))];
    }

    this.imports[lib] = imports;
  }
}
