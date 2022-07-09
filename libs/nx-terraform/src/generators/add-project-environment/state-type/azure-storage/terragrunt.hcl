inputs = {
}

remote_state {
  backend  = "azurerm"

  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    resource_group_name  = "<%= resourceGroupName %>"
    storage_account_name = "<%= storageAccountName %>"
    container_name       = "<%= containerName %>"
    key                  = "<%= storageKey %>"
    use_azuread_auth     = true
    use_oidc             = true
  }
}
