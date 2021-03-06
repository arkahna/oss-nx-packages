inputs = {
}

generate "remote_state" {
  path      = "backend.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  cloud {
    organization = "<%= organizationName %>"

    workspaces {
      name = "<%= workspaceName %>"
    }
  }
}
EOF
}
