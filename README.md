# CDK CLI

**This project is still in the early stages of development and may not be stable**

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@guardian/cdk-cli.svg)](https://npmjs.org/package/@guardian/cdk-cli)
[![License](https://img.shields.io/npm/l/cdk-cli.svg)](https://github.com/guardian/cdk-cli/blob/master/package.json)

<!-- toc -->
* [CDK CLI](#cdk-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

CDK CLI is a tool to make it easier to get started with [CDK](https://github.com/aws/aws-cdk) using the [@guardian/cdk](https://github.com/guardian/cdk) library.

## Deprecation Notice

We plan to deprecate this CLI and migrate all useful features to the [main Guardian CDK repository](https://github.com/guardian/cdk).
As a short-term fix for those looking to get a GuCDK stack up and running, here are some manual steps, expectations and notes regarding the process:

# Usage

<!-- usage -->
```sh-session
$ npm install -g @guardian/cdk-cli
$ cdk-cli COMMAND
running command...
$ cdk-cli (-v|--version|version)
@guardian/cdk-cli/1.2.0 darwin-x64 node-v14.18.0
$ cdk-cli --help [COMMAND]
USAGE
  $ cdk-cli COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`cdk-cli help [COMMAND]`](#cdk-cli-help-command)
* [`cdk-cli new`](#cdk-cli-new)

## `cdk-cli help [COMMAND]`

display help for cdk-cli

```
USAGE
  $ cdk-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.4/src/commands/help.ts)_

## `cdk-cli new`

Creates a new CDK stack

```
USAGE
  $ cdk-cli new

OPTIONS
  -h, --help                                       show CLI help
  -v, --version                                    show CLI version
  --app=app                                        (required) The name of your application e.g. Amigo

  --init                                           Create the cdk directory before building the app and stack files
                                                   (defaults to true)

  --multi-app                                      Create the stack files within sub directories as the project defines
                                                   multiple apps (defaults to false)

  --stack=stack                                    (required) The Guardian stack being used (as defined in your
                                                   riff-raff.yaml). This will be applied as a tag to all of your
                                                   resources.

  --yaml-template-location=yaml-template-location  Path to the YAML CloudFormation template
```

_See code: [src/commands/new.ts](https://github.com/guardian/cdk-cli/blob/v1.2.0/src/commands/new.ts)_
<!-- commandsstop -->

## Development

We follow the [`script/task`](https://github.com/github/scripts-to-rule-them-all) pattern,
find useful scripts within the [`script`](./script) directory for common tasks.

- `./script/setup` to install dependencies
- `./script/lint` to lint the code using ESLint
- `./script/test` to run the Jest unit tests
- `./script/build` to compile TypeScript to JS

There are also some other commands defined in `package.json`:

- `yarn lint --fix` attempt to autofix any linter errors
- `yarn format` format the code using Prettier

However, it's advised you configure your IDE to format on save to avoid horrible "correct linting" commits.
