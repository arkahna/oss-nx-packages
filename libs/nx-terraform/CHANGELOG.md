# @arkahna/nx-terraform

## 0.42.6

### Patch Changes

- Fix issue where nx is unable to find environments directory configured in nx.json ([#75](https://github.com/arkahna/oss-nx-packages/pull/75))

## 0.42.5

### Patch Changes

- Fixed issue with environment file location ([`7f94709`](https://github.com/arkahna/oss-nx-packages/commit/7f94709148e887a9b829e554613418736d2b8f02))

## 0.42.4

### Patch Changes

- Increased firewallRetryAttempts to 12 (total 1 minute wait) as 25seconds often times out ([`ef115b5`](https://github.com/arkahna/oss-nx-packages/commit/ef115b50bdfcfd3bb14d15a0d7c76c9dd8607b86))

## 0.42.3

### Patch Changes

- Fixed path issue from previous fix ([`a095606`](https://github.com/arkahna/oss-nx-packages/commit/a0956067696e266cbaf2321873f73d8e3db27d5a))

## 0.42.2

### Patch Changes

- Fixed apply erroring when an environment doesn't exist for a project ([`6999fa8`](https://github.com/arkahna/oss-nx-packages/commit/6999fa8f8cd0816d02d07e7521fa8f9c4b059969))

## 0.42.1

### Patch Changes

- Can't use workspace layout for customising the location of nx-terraform folders, that does not validate the nx schema ([#69](https://github.com/arkahna/oss-nx-packages/pull/69))

## 0.42.0

### Minor Changes

- Implemented project specific environments ([#66](https://github.com/arkahna/oss-nx-packages/pull/66))

- Add option to auto approve Destroy action ([#65](https://github.com/arkahna/oss-nx-packages/pull/65))

## 0.41.0

### Minor Changes

- [#61](https://github.com/arkahna/oss-nx-packages/pull/61) [`ce76a12`](https://github.com/arkahna/oss-nx-packages/commit/ce76a121c96255a609057a27b65e0e8e2582c2a9) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Added force-unlock executor to terraform projects

- [#61](https://github.com/arkahna/oss-nx-packages/pull/61) [`ce76a12`](https://github.com/arkahna/oss-nx-packages/commit/ce76a121c96255a609057a27b65e0e8e2582c2a9) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Allowed specifying standalone NX terraform project

- [#61](https://github.com/arkahna/oss-nx-packages/pull/61) [`ce76a12`](https://github.com/arkahna/oss-nx-packages/commit/ce76a121c96255a609057a27b65e0e8e2582c2a9) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Stopped updating tfprojects/README.md, doing this isn't idiomatic NX

## 0.40.0

### Minor Changes

- [#58](https://github.com/arkahna/oss-nx-packages/pull/58) [`1b479ee`](https://github.com/arkahna/oss-nx-packages/commit/1b479ee64e3462e699171bd714828dab9cfcc72d) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Changed default directory of modules and apps. See readme how to configure back to original

## 0.39.1

### Patch Changes

- [#54](https://github.com/arkahna/oss-nx-packages/pull/54) [`4a53ecf`](https://github.com/arkahna/oss-nx-packages/commit/4a53ecf97b0de41a77bbc02d2c3bcdb26c1d0251) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed location shortname

## 0.39.0

### Minor Changes

- [#52](https://github.com/arkahna/oss-nx-packages/pull/52) [`bd45e9a`](https://github.com/arkahna/oss-nx-packages/commit/bd45e9a8e55d7eca828b2e346ae3446d8df707cc) Thanks [@emlyn-arkahna](https://github.com/emlyn-arkahna)! - Add retry when getting resource names from terraform

* [#47](https://github.com/arkahna/oss-nx-packages/pull/47) [`7cca9ec`](https://github.com/arkahna/oss-nx-packages/commit/7cca9ecd67fe745b3fcf817ae76cf716575c6200) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Add remove firewall rule generator

## 0.38.1

### Patch Changes

- [#49](https://github.com/arkahna/oss-nx-packages/pull/49) [`4c5e59e`](https://github.com/arkahna/oss-nx-packages/commit/4c5e59eb38ae27cc510413d980dcbb89019b9e60) Thanks [@emlyn-arkahna](https://github.com/emlyn-arkahna)! - Fix storage account name matching

## 0.38.0

### Minor Changes

- [#45](https://github.com/arkahna/oss-nx-packages/pull/45) [`2a3f034`](https://github.com/arkahna/oss-nx-packages/commit/2a3f034fb846582ef93461b13b7908a89d0e9084) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Validate correct subscription selected

## 0.37.2

### Patch Changes

- [#40](https://github.com/arkahna/oss-nx-packages/pull/40) [`7db77d1`](https://github.com/arkahna/oss-nx-packages/commit/7db77d162a509ea05e45a9b896e5fbdaaba42d38) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Restored allowing environment to be passed to init

## 0.37.1

### Patch Changes

- [#38](https://github.com/arkahna/oss-nx-packages/pull/38) [`df7cde3`](https://github.com/arkahna/oss-nx-packages/commit/df7cde31599808da42272d901ff74af259dead12) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed additional prop being validated

## 0.37.0

### Minor Changes

- [#36](https://github.com/arkahna/oss-nx-packages/pull/36) [`1546190`](https://github.com/arkahna/oss-nx-packages/commit/1546190f5e28d2ca7865bd669030a8a272512aa1) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Simplified tf init using the local environment

### Patch Changes

- [#36](https://github.com/arkahna/oss-nx-packages/pull/36) [`fd54743`](https://github.com/arkahna/oss-nx-packages/commit/fd547430d7e34e5573722507d4a24aa148545bac) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fix updated vscode terraform plugin setting name

## 0.36.0

### Minor Changes

- [#33](https://github.com/arkahna/oss-nx-packages/pull/33) [`9d5c86f`](https://github.com/arkahna/oss-nx-packages/commit/9d5c86fc0f3d907498fcf9274dc7932ea7d453d5) Thanks [@emlyn-arkahna](https://github.com/emlyn-arkahna)! - Update azure naming standard

* [#35](https://github.com/arkahna/oss-nx-packages/pull/35) [`91321c0`](https://github.com/arkahna/oss-nx-packages/commit/91321c0e41b1be2f44e6a3769aa9bec29203a261) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Ensure correct tenant/sub when creating service principal

## 0.35.1

### Patch Changes

- [#27](https://github.com/arkahna/oss-nx-packages/pull/27) [`f459fb0`](https://github.com/arkahna/oss-nx-packages/commit/f459fb0b86a45b2b2ad7f128eba21b275872175f) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed generate service principal role assignment

## 0.35.0

### Minor Changes

- [#24](https://github.com/arkahna/oss-nx-packages/pull/24) [`1456df1`](https://github.com/arkahna/oss-nx-packages/commit/1456df10f9082445fc3f512684081c92b1512d44) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Add new generator to create a service principal for deployment

## 0.34.7

### Patch Changes

- [`bfcc0b0`](https://github.com/arkahna/oss-nx-packages/commit/bfcc0b0a0b118d5a29dcb58fdfa077dfd1c7f1e6) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed var's not being passed through on apply

* [`fc7f766`](https://github.com/arkahna/oss-nx-packages/commit/fc7f766a035e51bc90a08e4f6479f28e3182fb35) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed another bug in the output executor

## 0.34.6

### Patch Changes

- Fixed output executor logging, it should only log the output

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
