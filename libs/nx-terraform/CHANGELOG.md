# @arkahna/nx-terraform

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
