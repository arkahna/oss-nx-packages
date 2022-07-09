# NX Workspace

Arkahna's workspace plugin to help configure NX repositories meeting our dev practices

## Installation

```
pnpm add @arkahna/nx-workspace
```

## Executors

### run-command

The run-command executor in NX supports running multiple commands in parallel etc, but it doesn't support interactive CLI tools.

This executor can be used to execute a single command which required interactivity

#### Usage

```
"serve": {
    "executor": "@arkahna/nx-workspace:run-command",
    "options": {
        "command": "dotnet watch msbuild /t:RunFunctions",
        "cwd": "apps/my-app"
    }
},
```

## Generators

### setup-pnpm

Configures the PNPM package manager for this NX repo

### Usage

```
npx nx generate @arkahna/nx-workspace:setup-pnpm
```

### setup-changesets

[Changesets](https://github.com/changesets/changesets) is a NPM CLI tool which enables you to create and manage your changelogs.

### Usage

```
npx nx generate @arkahna/nx-workspace:setup-changesets
```

## setup-js

Configures TypeScript for use in this mono repo, WARNING this will setup recommended defaults, potentially overriding some custom setup if this isn't a new repository

Includes:

-   prettier
-   vscode settings
-   vscode recommended extensions
-   vscode tasks / launch settings
-   vitest for testing
-   eslint
-   recommended tsconfig settings
