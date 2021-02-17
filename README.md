# CDK CLI

CDK CLI is a tool to make it easier to get started with [CDK](https://github.com/aws/aws-cdk) using the [@guardian/cdk](https://github.com/guardian/cdk) library.

**This project is still in the early stages of development and may not be stable**

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cdk-cli.svg)](https://npmjs.org/package/cdk-cli)
[![Downloads/week](https://img.shields.io/npm/dw/cdk-cli.svg)](https://npmjs.org/package/cdk-cli)
[![License](https://img.shields.io/npm/l/cdk-cli.svg)](https://github.com/guardian/cdk-cli/blob/master/package.json)

<!-- toc -->
* [CDK CLI](#cdk-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @guardian/cdk-cli
$ cdk-cli COMMAND
running command...
$ cdk-cli (-v|--version|version)
@guardian/cdk-cli/0.0.0 darwin-x64 node-v14.15.1
$ cdk-cli --help [COMMAND]
USAGE
  $ cdk-cli COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`cdk-cli help [COMMAND]`](#cdk-cli-help-command)
* [`cdk-cli init [OUTPUT]`](#cdk-cli-init-output)
* [`cdk-cli migrate TEMPLATE OUTPUT APP [STACK]`](#cdk-cli-migrate-template-output-app-stack)
* [`cdk-cli new OUTPUT APP STACK`](#cdk-cli-new-output-app-stack)

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `cdk-cli init [OUTPUT]`

Creates a new directory containing boilerplate configuration

```
USAGE
  $ cdk-cli init [OUTPUT]

ARGUMENTS
  OUTPUT  [default: ./cdk] The path of the new directory to create. Defaults to ./cdk

OPTIONS
  -h, --help     show CLI help
  -v, --version  show CLI version
```

_See code: [src/commands/init.ts](https://github.com/guardian/cdk-cli/blob/v0.0.0/src/commands/init.ts)_

## `cdk-cli migrate TEMPLATE OUTPUT APP [STACK]`

Migrates from a cloudformation template to Guardian flavoured CDK

```
USAGE
  $ cdk-cli migrate TEMPLATE OUTPUT APP [STACK]

ARGUMENTS
  TEMPLATE  The template file to migrate
  OUTPUT    The CDK directory to migrate the stack to
  APP       The name of the app that the stack belongs to
  STACK     A name to give the stack. Defaults to match the filename.

OPTIONS
  -h, --help     show CLI help
  -v, --version  show CLI version
  --init         create the cdk directory before building the app and stack files
  --multi-app    create the stack files within sub directories as the project defines multiple apps
```

_See code: [src/commands/migrate.ts](https://github.com/guardian/cdk-cli/blob/v0.0.0/src/commands/migrate.ts)_

## `cdk-cli new OUTPUT APP STACK`

Creates a new CDK stack

```
USAGE
  $ cdk-cli new OUTPUT APP STACK

ARGUMENTS
  OUTPUT  The CDK directory to create the new files in
  APP     A name to give the app
  STACK   A name to give the stack

OPTIONS
  -h, --help     show CLI help
  -v, --version  show CLI version
  --init         create the cdk directory before building the app and stack files
  --multi-app    create the stack files within sub directories as the project defines multiple apps
```

_See code: [src/commands/new.ts](https://github.com/guardian/cdk-cli/blob/v0.0.0/src/commands/new.ts)_
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
