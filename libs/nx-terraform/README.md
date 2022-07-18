# NX Terraform

Produces the ability to setup a NX repo with Terraform with Terragrunt for Azure environment management.

## Installation

```
pnpm add @arkahna/nx-terraform
```

### Azure Support

Then add the Azure specific dependencies:

```
pnpm add @azure/arm-resources @azure/identity @azure/logger
```

## Concepts

| Concept     | Description                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------- |
| Environment | An environment like dev, prod etc. There will be a terragrunt file in each project which deploys to that environment |

## Repository Level Generators

This plugin has 2 levels of generators, the first level operates at the repository level. For example environments exist at the repo level, ie you create an environment, then for each project you configure that project to deploy to that environment.

### Init

Ensure you have run `pnpm exec nx g @arkahna/nx-terraform:tf-init` to setup the repo

The plugin supports both terraform cloud and azure storage.

To use Terraform Cloud you to have a Terraform Cloud Organization created for this project. If you don't have one [create one here](https://app.terraform.io/app/organizations/new)

Also ensure the client has registered the following Resource Providers via the portal:

- Microsoft.KeyVault
- Microsoft.Network
- Microsoft.Storage

#### Azure workload name

When naming Azure resources the standard is [<prefix>-]<resource abbreviation>-<workload> generally, the workload is defined at the repository level and can be overridden at the project level.

### Create Azure Environment

Environments have a base set of configuration and infrastructure. They normally contain:

- A resource group
- A KeyVault
- A Storage Account (for storing terraform state for the environment)
- A VNet and default subnet for all non-delegated infrastructure for the projects in the repository
- Private links for the KeyVault so it can be accessed from the VNet but not publicly

You can choose to get NX to generate this infrastructure or specify id's of existing infrastructure to use instead.

#### Usage

    nx g @arkahna/nx-terraform:create-azure-environment

## Generators

You can also use the NX VSCode Extension to get a UI for each of these generators rather than using the terminal.

### project

Creates a new Terraform project in the repo

#### Usage

```

pnpm nx g @arkahna/nx-terraform:project <projectname>

```

### add-project-environment

Adds a terragrunt configuration for that environment.

#### Usage

```
pnpm nx g \
  @arkahna/nx-terraform:add-project-environment \
  <projectname> \
  --environment <environmentname>

```

## Executors

### Apply

`nx apply <tf-project> --environment <env>`

If you are running apply multiple times locally, run with `--leaveFirewallExceptions` to leave the firewall exceptions intact, then run with `--quick` to skip adding firewall rules, running init and skipping refresh during the plan phase.

### Lint

Needs tfsec installed, or set tfsec command to false. See https://github.com/aquasecurity/tfsec#installation
