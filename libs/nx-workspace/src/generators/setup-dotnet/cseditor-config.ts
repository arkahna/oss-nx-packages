export const csSettings = `# You can modify the rules from these initially generated values to suit your own policies
# You can learn more about editorconfig here: https://docs.microsoft.com/en-us/visualstudio/ide/editorconfig-code-style-settings-reference
[*.cs]


#Core editorconfig formatting - indentation

#Formatting - new line options

#place catch statements on a new line
csharp_new_line_before_catch = true
#place else statements on a new line
csharp_new_line_before_else = true
#require members of anonymous types to be on the same line
csharp_new_line_before_members_in_anonymous_types = false
#require members of object initializers to be on the same line
csharp_new_line_before_members_in_object_initializers = false
#require braces to be on a new line for lambdas, methods, types, and control_blocks (also known as "Allman" style)
csharp_new_line_before_open_brace = lambdas, methods, types, control_blocks
#require elements of query expression clauses to be on separate lines
csharp_new_line_between_query_expression_clauses = true

#Formatting - organize using options

#sort System.* using directives alphabetically, and place them before other usings
dotnet_sort_system_directives_first = true

#Formatting - spacing options

#require NO space between a cast and the value
csharp_space_after_cast = false
#require a space before the colon for bases or interfaces in a type declaration
csharp_space_after_colon_in_inheritance_clause = true
#require a space after a keyword in a control flow statement such as a for loop
csharp_space_after_keywords_in_control_flow_statements = true
#require a space before the colon for bases or interfaces in a type declaration
csharp_space_before_colon_in_inheritance_clause = true
#remove space within empty argument list parentheses
csharp_space_between_method_call_empty_parameter_list_parentheses = false
#remove space between method call name and opening parenthesis
csharp_space_between_method_call_name_and_opening_parenthesis = false
#do not place space characters after the opening parenthesis and before the closing parenthesis of a method call
csharp_space_between_method_call_parameter_list_parentheses = false
#remove space within empty parameter list parentheses for a method declaration
csharp_space_between_method_declaration_empty_parameter_list_parentheses = false
#place a space character after the opening parenthesis and before the closing parenthesis of a method declaration parameter list.
csharp_space_between_method_declaration_parameter_list_parentheses = false

#Formatting - wrapping options

#leave code block on single line
csharp_preserve_single_line_blocks = true
#leave statements and member declarations on the same line
csharp_preserve_single_line_statements = true

#Style - Code block preferences

#prefer curly braces even for one line of code
csharp_prefer_braces = csharp_prefer_braces:suggestion

#Style - expression bodied member options

#prefer block bodies for constructors
csharp_style_expression_bodied_constructors = false:suggestion
#prefer expression-bodied members for methods when they will be a single line
csharp_style_expression_bodied_methods = when_on_single_line:suggestion
#prefer expression-bodied members for properties
csharp_style_expression_bodied_properties = true:suggestion

#Style - expression level options

#prefer out variables to be declared before the method call
csharp_style_inlined_variable_declaration = false:suggestion
#prefer the language keyword for member access expressions, instead of the type name, for types that have a keyword to represent them
dotnet_style_predefined_type_for_member_access = true:suggestion

#Style - Expression-level  preferences

#prefer default over default(T)
csharp_prefer_simple_default_expression = true:suggestion
#prefer objects to be initialized using object initializers when possible
dotnet_style_object_initializer = true:suggestion
#prefer inferred anonymous type member names
dotnet_style_prefer_inferred_anonymous_type_member_names = false:suggestion
#prefer inferred tuple element names
dotnet_style_prefer_inferred_tuple_names = true:suggestion

#Style - implicit and explicit types

#prefer var over explicit type in all cases, unless overridden by another code style rule
csharp_style_var_elsewhere = true:suggestion
#prefer var is used to declare variables with built-in system types such as int
csharp_style_var_for_built_in_types = true:suggestion
#prefer var when the type is already mentioned on the right-hand side of a declaration expression
csharp_style_var_when_type_is_apparent = true:suggestion

#Style - language keyword and framework type options

#prefer the language keyword for local variables, method parameters, and class members, instead of the type name, for types that have a keyword to represent them
dotnet_style_predefined_type_for_locals_parameters_members = true:suggestion

#Style - modifier options

#prefer accessibility modifiers to be declared except for public interface members. This will currently not differ from always and will act as future proofing for if C# adds default interface methods.
dotnet_style_require_accessibility_modifiers = for_non_interface_members:suggestion

#Style - Modifier preferences

#when this rule is set to a list of modifiers, prefer the specified ordering.
csharp_preferred_modifier_order = public,private,protected,internal,readonly,static,abstract,override,virtual,async:suggestion

#Style - Pattern matching

#prefer pattern matching instead of is expression with type casts
csharp_style_pattern_matching_over_as_with_null_check = true:suggestion

#Style - qualification options

#prefer fields not to be prefaced with this. or Me. in Visual Basic
dotnet_style_qualification_for_field = false:suggestion
#prefer methods not to be prefaced with this. or Me. in Visual Basic
dotnet_style_qualification_for_method = false:suggestion
#prefer properties not to be prefaced with this. or Me. in Visual Basic
dotnet_style_qualification_for_property = false:suggestion

dotnet_diagnostic.RemoveUnnecessaryImportsFixable.severity=suggestion


#Resharper
resharper_unused_member_global_highlighting=do_not_show
resharper_unused_member_in_super_global_highlighting=do_not_show
resharper_unused_parameter_global_highlighting=do_not_show

resharper_unused_auto_property_accessor_global_highlighting=do_not_show
resharper_unused_type_global_highlighting=do_not_show

resharper_class_never_instantiated_global_highlighting=do_not_show
resharper_member_can_be_private_global_highlighting=do_not_show
resharper_collection_never_updated_global_highlighting=do_not_show
`
