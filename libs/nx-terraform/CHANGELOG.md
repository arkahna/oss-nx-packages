# @arkahna/nx-terraform

## 0.34.5

### Patch Changes

- Removed output from cli commands adding / removing firewall rules, it's noisy

## 0.34.4

### Patch Changes

- [#20](https://github.com/arkahna/oss-nx-packages/pull/20) [`e8970f8`](https://github.com/arkahna/oss-nx-packages/commit/e8970f8efa203ba2736ea26c0de512f4692c7d45) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Further fixes to output handling

## 0.34.3

### Patch Changes

- [#17](https://github.com/arkahna/oss-nx-packages/pull/17) [`6ffe24c`](https://github.com/arkahna/oss-nx-packages/commit/6ffe24cb5d113c2cab1ef8b8611d07c06a9042b6) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed lint issue on generated project

* [#19](https://github.com/arkahna/oss-nx-packages/pull/19) [`64653d7`](https://github.com/arkahna/oss-nx-packages/commit/64653d7acd53badfc9d2a8ccc9b485301e402fe5) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed issue with azure cli auth

## 0.34.2

### Patch Changes

- [#15](https://github.com/arkahna/oss-nx-packages/pull/15) [`2922674`](https://github.com/arkahna/oss-nx-packages/commit/2922674b2b9506067c5857000dca280938e76fe4) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed issue where add-project-environment was erroring due to missing vnet

## 0.34.1

### Patch Changes

- [#13](https://github.com/arkahna/oss-nx-packages/pull/13) [`f5550c8`](https://github.com/arkahna/oss-nx-packages/commit/f5550c80ee7d349e35fb2c3f3db7734d54cfebcf) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed issue where stdout wouldn't always be visible

## 0.34.0

### Minor Changes

- [#11](https://github.com/arkahna/oss-nx-packages/pull/11) [`5bff4af`](https://github.com/arkahna/oss-nx-packages/commit/5bff4af24ee9a10ac2f2adaef16fb72be29b996b) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Use azure terraform naming module for naming

## 0.33.3

### Patch Changes

- [#9](https://github.com/arkahna/oss-nx-packages/pull/9) [`61ed46e`](https://github.com/arkahna/oss-nx-packages/commit/61ed46ef2ee8ba6aa3874bbaa1cc846c19f6f854) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Removed tfsec option from generators where it isn't used

## 0.33.2

### Patch Changes

- [#7](https://github.com/arkahna/oss-nx-packages/pull/7) [`36af57c`](https://github.com/arkahna/oss-nx-packages/commit/36af57c1d57d222c7f04ac3ad6daed9d827e556c) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed private dns for keyvault being created by generator

## 0.33.1

### Patch Changes

- [#5](https://github.com/arkahna/oss-nx-packages/pull/5) [`9162fa3`](https://github.com/arkahna/oss-nx-packages/commit/9162fa33d28cc39fa874832844dc11d53767eb0b) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed some left over required props

## 0.33.0

### Minor Changes

- [#3](https://github.com/arkahna/oss-nx-packages/pull/3) [`1b05e0f`](https://github.com/arkahna/oss-nx-packages/commit/1b05e0ffc3483ebc4ecb72661cbd00d35b927c6e) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Add tfsec into terraform linting

* [#3](https://github.com/arkahna/oss-nx-packages/pull/3) [`b008ec9`](https://github.com/arkahna/oss-nx-packages/commit/b008ec9983df08419679eb78b12cd4f3f972ac10) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - BREAKING: No longer provisions any networking resources, they should be created in terraform if required

### Patch Changes

- [#3](https://github.com/arkahna/oss-nx-packages/pull/3) [`b008ec9`](https://github.com/arkahna/oss-nx-packages/commit/b008ec9983df08419679eb78b12cd4f3f972ac10) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed modules project.json having old targets

## 0.32.0

### Minor Changes

- [#1](https://github.com/arkahna/oss-nx-packages/pull/1) [`c0dd855`](https://github.com/arkahna/oss-nx-packages/commit/c0dd855e6cd8d6260692b63a75bd895445554c92) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Introduce --quick mode for terraform apply

* [#1](https://github.com/arkahna/oss-nx-packages/pull/1) [`c0dd855`](https://github.com/arkahna/oss-nx-packages/commit/c0dd855e6cd8d6260692b63a75bd895445554c92) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Added add-firewall-exceptions generator

## 0.31.3

### Patch Changes

- [`dda9400`](https://github.com/arkahna/oss-nx-packages/commit/dda9400de14e8347db67e28da2c6b3e6868ad1b0) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Further improved the dry run messages

## 0.31.2

### Patch Changes

- Improved dry run logging

## 0.31.0

### Minor Changes

- [#1](https://github.com/arkahna/oss-nx-packages/pull/1) [`7df4eaf`](https://github.com/arkahna/oss-nx-packages/commit/7df4eafc303e782be25b431a5d8ef3d9ffbc3bcb) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Initial oss release

### Patch Changes

- Updated dependencies [[`7df4eaf`](https://github.com/arkahna/oss-nx-packages/commit/7df4eafc303e782be25b431a5d8ef3d9ffbc3bcb)]:
  - @arkahna/nx-workspace@0.3.0
