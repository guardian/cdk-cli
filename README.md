cdk-migrator
========

**This tool is a work in progress. It relies on the as-yet-unpublished Guardian CDK library.**

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cdk-migrator.svg)](https://npmjs.org/package/cdk-migrator)
[![Downloads/week](https://img.shields.io/npm/dw/cdk-migrator.svg)](https://npmjs.org/package/cdk-migrator)
[![License](https://img.shields.io/npm/l/cdk-migrator.svg)](https://github.com/guardian/cdk-migrator/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @guardian/cdk-migrator
$ cdk-migrator COMMAND
running command...
$ cdk-migrator (-v|--version|version)
@guardian/cdk-migrator/0.0.0 darwin-x64 node-v10.15.3
$ cdk-migrator --help [COMMAND]
USAGE
  $ cdk-migrator COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cdk-migrator help [COMMAND]`](#cdk-migrator-help-command)
* [`cdk-migrator migrate TEMPLATE OUTPUT STACK`](#cdk-migrator-migrate-template-output-stack)

## `cdk-migrator help [COMMAND]`

display help for cdk-migrator

```
USAGE
  $ cdk-migrator help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `cdk-migrator migrate TEMPLATE OUTPUT STACK`

Migrates from a cloudformation template to Guardian flavoured CDK

```
USAGE
  $ cdk-migrator migrate TEMPLATE OUTPUT STACK

ARGUMENTS
  TEMPLATE  The template file to migrate
  OUTPUT    The file to output CDK to
  STACK     The name to give the stack

OPTIONS
  -h, --help     show CLI help
  -v, --version  show CLI version
```

_See code: [src/commands/migrate.ts](https://github.com/guardian/cdk-migrator/blob/v0.0.0/src/commands/migrate.ts)_
<!-- commandsstop -->
