# cdk-cli

**This tool is a work in progress. It relies on the as-yet-unpublished Guardian CDK library.**

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cdk-cli.svg)](https://npmjs.org/package/cdk-cli)
[![Downloads/week](https://img.shields.io/npm/dw/cdk-cli.svg)](https://npmjs.org/package/cdk-cli)
[![License](https://img.shields.io/npm/l/cdk-cli.svg)](https://github.com/guardian/cdk-cli/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @guardian/cdk-cli
$ cdk-cli COMMAND
running command...
$ cdk-cli (-v|--version|version)
@guardian/cdk-cli/0.0.0 darwin-x64 node-v10.15.3
$ cdk-cli --help [COMMAND]
USAGE
  $ cdk-cli COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`cdk-cli help [COMMAND]`](#cdk-cli-help-command)
- [`cdk-cli migrate TEMPLATE OUTPUT STACK`](#cdk-cli-migrate-template-output-stack)

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `cdk-cli migrate TEMPLATE OUTPUT STACK`

Migrates from a cloudformation template to Guardian flavoured CDK

```
USAGE
  $ cdk-cli migrate TEMPLATE OUTPUT STACK

ARGUMENTS
  TEMPLATE  The template file to migrate
  OUTPUT    The file to output CDK to
  STACK     The name to give the stack

OPTIONS
  -h, --help     show CLI help
  -v, --version  show CLI version
```

_See code: [src/commands/migrate.ts](https://github.com/guardian/cdk-cli/blob/v0.0.0/src/commands/migrate.ts)_

<!-- commandsstop -->
