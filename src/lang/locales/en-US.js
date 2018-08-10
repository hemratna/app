export const dateTimeFormats = {
  short: {
    year: "numeric",
    month: "short",
    day: "numeric"
  },
  long: {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  }
};

export default {
  about_directus: "About Directus",
  activity: "Activity",
  activity_log: "Activity Log",
  activity_outside_directus: "This item was created outside of Directus.",
  admin_email: "Admin Email",
  admin_password: "Admin Password",
  additional_info: "Additional Info",
  add_new: "Add new",
  add_field_filter: "Add a field filter",
  add_note: "Add a helpful note for users...",
  admin_settings: "Admin Settings",
  almost_done_options:
    "Almost Done! Now just review the interface options below.",
  almost_done_copy:
    "Every interface can be perfectly tailored to your needs. Below are the available options for this field, but only some are required.",
  all: "All",
  allowed_statuses: "Allowed Statuses",
  api_url: "API URL",
  api_installed: "API Successfully Installed",
  auto_generated: "Automatically generated...",
  batch: "Batch",
  batch_edit: "Batch edit",
  batch_delete: "Batch Delete",
  batch_delete_confirm:
    "No items have been selected | One item will be deleted. | {count} items will be deleted.",
  between: "Between",
  both: "Both",
  bookmarks: "Bookmarks",
  cancel: "Cancel",
  change_project: "Change Project",
  choose_one: "Choose one",
  choose_project: "Choose Project",
  choose_interface: "Choose an interface for how this data should be managed.",
  connection: "Connection",
  collection: "Collection",
  collection_updated: "{collection} Collection Updated",
  collection_removed: "{collection} Collection Removed",
  collection_names_cannot_be_changed:
    "Collection names cannot be edited at this time.",
  collections: "Collections",
  collection_count: "No Collections | One Collection | {count} Collections",
  "collections-directus_files": "Files",
  "collections-directus_users": "Users",
  "collections-directus_activity": "Activity",
  comment: "Comment",
  comments: "Comments",
  coming_soon: "Coming Soon",
  contains: "Contains",
  collection_contains_items: "{collection} contains {count} items",
  currently_selected: "Currently selected: {thing}",
  create: "Create",
  creating_item: "Creating Item",
  creating_role: "Creating Role",
  create_field: "Create Field",
  create_collection: "Create Collection",
  database_connection: "Database Connection",
  database_connection_copy:
    "Next, we need to know how to connect to the database where this project will be managed.",
  datatype: "Datatype",
  db_user: "Database User",
  db_password: "Database User Password",
  db_name: "Database Name",
  db_type: "Database Type",
  default: "Default",
  delete: "Delete",
  delete_are_you_sure:
    "Are you sure you want to delete this item? This action can not be undone.",
  delete_collection_are_you_sure:
    "Are you sure you want to delete this collection? This action can not be undone.",
  delete_field_are_you_sure:
    'Are you sure you want to delete the field "{field}"? This action can not be undone.',
  delete_role_are_you_sure:
    'Are you sure to delete the role "{name}"? This action cannot be undone.',
  delete_bookmark: "Delete Bookmark",
  delete_bookmark_body:
    "Are you sure you want to delete this bookmark? This action cannot be undone.",
  description: "Description",
  delete_confirmation: "Delete Confirmation",
  dialog_beginning: "Beginning of dialog window.",
  discard_changes: "Discard Changes",
  display_name: "Display Name",
  drop_files: "Drop files here...",
  dont_show: "Don't Show",
  editing: "Editing {collection}",
  editing_item: "Editing Item",
  editing_single: "Editing {collection}",
  email_address: "Email Address",
  email: "Email",
  empty_collection: "Empty Collection",
  empty_collection_body: "There are no items in this collection yet",
  enable_manual_sorting: "Enable manual sorting",
  enter_value: "Enter Value",
  enter_collection_name: "Enter collection name...",
  environment: "Environment",
  errors: {
    "-1": "Couldn't reach API",
    11: "Can't connect to database",
    100: "Wrong username and/or password",
    101: "Logged out due to inactivity",
    102: "Logged out due to inactivity",
    103: "User inactive",
    106: "Wrong username and/or password"
  },
  error_unknown: "Unknown error. Try again later.",
  esc_cancel: "Escape will cancel and close the window.",
  equal_to: "Equal to",
  existing: "Existing",
  fetching_data: "Fetching Data",
  field: "Field",
  field_created: "{field} Field Created",
  field_updated: "{field} Field Updated",
  field_removed: "{field} Field Removed",
  fields: "Fields",
  fields_are_saved_automatically: "Field settings are saved automatically",
  file: "File",
  file_library: "File Library",
  file_upload: "Upload File(s)",
  forgot_password: "Forgot Password",
  greater_than_equal: "Greater than or equal to",
  greater_than: "Greater than",
  help_and_docs: "Help & Docs",
  keep_editing: "Keep editing",
  hidden_input: "Hidden on Details",
  hidden_list: "Hidden on List",
  host: "Host",
  in_list: "One of these",
  initial_schema: "Choose an Initial Schema",
  initial_schema_copy:
    "Choose from existing database architectures or start fresh. You can always extend and tweak this later.",
  interface: "Interface",
  interface_count: "No Interfaces | One Interface | {count} Interfaces",
  interfaces: "Interfaces",
  info: "Info",
  intelligent_defaults:
    "Directus sets intelligent defaults for the more advanced configuration settings, but you can override those here too!",
  interface_settings:
    "Every interface can be perfectly tailored to your needs. Below are the available options for this interface, but only some are required.",
  install: "Install",
  install_copy:
    "This API has not yet been configured. Would you like to install and configure it now?",
  is_empty: "Is empty",
  is_not_null: "Is not NULL",
  is_null: "Is NULL",
  item_count: "No Items | One Item | {count} Items",
  event_count: "No Events | One Event | {count} Events",
  role_count: "No Roles | One Role | {count} Roles",
  item_count_filter:
    "No Filtered Items | One Filtered Item | {count} Filtered Items",
  item_deleted: "Item Deleted",
  item_saved: "Item Saved",
  extension_error: "There was a problem loading the {ext} extension.",
  latency: "Latency",
  learn_more: "Learn More",
  leave_comment: "Leave a comment...",
  length: "Length",
  less_than_equal: "Less than or equal to",
  less_than: "Less than",
  limited: "Limited",
  loading: "Loading...",
  loading_more: "Loading more items...",
  login: "Log in",
  name: "Name",
  name_field:
    "Let’s name this {field} field and configure how it will save data.",
  navigate_changes:
    "Are you sure you want to leave this page? The changes you made will be lost if you navigate away from this page.",
  new: "New",
  new_file: "New File",
  no_related_entries: "Has no related entries",
  not_between: "Not between",
  not_contains: "Doesn't contain",
  note: "Note",
  no_results: "No Results",
  no_results_body: "The current filters do not match any collection items",
  no_collections: "No Collections Setup",
  no_collections_body: "It seems like there aren't any collections setup yet",
  no_fields: "No Fields Setup",
  no_fields_body:
    "It seems like this collection doesn't have any fields setup yet",
  no_files: "No Files",
  no_files_body: "It seems like there haven't been any files uploaded yet",
  page_not_found: "Page Not Found",
  page_not_found_body: "The page you are looking for doesn't seem to exist.",
  permissions: "Permissions",
  name_bookmark: "What would you like to name this bookmark?",
  next: "Next",
  not_empty: "Is not empty",
  not_equal_to: "Not equal to",
  not_in_list: "Not one of these",
  manage: "Manage",
  dont_manage: "Don't Manage",
  dont_manage_copy:
    "Privileges, preferences, and settings for the {collection} collection will be permanently removed from the system! Are you sure?",
  more_options: "More options",
  mixed: "Mixed",
  my_profile: "My Profile",
  other: "Other",
  ok: "OK",
  operator: "Operator",
  options: "Options",
  password: "Password",
  password_reset_sent: "Password reset email sent to {email}",
  permission_states: {
    none: "No Items",
    mine: "My Items Only",
    role: "Role Items Only",
    full: "All Items",
    create: "Only On Creation",
    update: "Only On Update",
    always: "Always"
  },
  powered_by_directus: "Powered by Directus",
  preview_and_revert: "Preview and Revert",
  port: "Port",
  project: "Project",
  project_name: "Project Name",
  project_info: "Project Information",
  project_info_copy:
    "Below are a few questions about your project, including the credentials of your first administrator.",
  read: "Read",
  read_blacklist: "Read Blacklist",
  read_blacklist_copy: "Select the fields that the user can view",
  readonly: "Readonly",
  regex: "RegEx",
  related_entries: "Has related entries",
  remove: "Remove",
  remove_related: "Remove Related Item",
  relationship: "Relationship",
  required: "Required",
  reset_preferences: "Reset all listing preferences",
  reset_password: "Reset Password",
  revert: "Revert",
  revert_copy:
    "Do you want to revert the values of this item to how they were on {date}?",
  roles: "User Roles",
  role_settings: "Role Settings",
  save: "Save",
  save_and_add: "Save and Add New",
  save_and_stay: "Save and Stay",
  save_as_copy: "Save as Copy",
  save_as_bookmark: "Save as Bookmark",
  schema: "Schema",
  search: "Search",
  select_from_device: "Select from device",
  select_existing: "Select Existing",
  select_field: "Select a Field",
  select_fields: "Select Fields",
  search_interface: "Search for an interface...",
  select_interface_below: "Select an interface below",
  select_statuses: "Select Statuses",
  select_statuses_copy: "Select the statuses the user can use",
  settings: "Settings",
  settings_interface: "Interface Settings",
  settings_global: "Global Settings",
  settings_collections_fields: "Collections & Fields",
  settings_permissions: "Roles & Permissions",
  settings_extensions: "Extensions",
  server_details: "Server Details",
  server_error: "Server Error",
  server_error_copy:
    "Something is wrong with this instance’s server or database.",
  server_trouble: "Server Trouble",
  server_trouble_copy:
    "Try again later or contact your system administrator help.",
  show_advanced_options: "Show advanced options",
  something_went_wrong: "Something went wrong..",
  something_went_wrong_body:
    "We're having some trouble processing your request.. Please try again by refreshing this page. If the problem persists, please contact your system administrator.",
  sign_in: "Sign In",
  signing_in: "Signing In",
  sign_out: "Sign Out",
  sign_out_confirm: "Are you sure you want to sign out?",
  to: "To",
  unsaved_changes_copy:
    "You have unsaved changes! Are you sure you want to leave this page?",
  user_directory: "User Directory",
  update: "Update",
  update_confirm: "Are you sure you want to update {count} items?",
  unique: "Unique",
  user_edit_warning:
    "{first_name} {last_name} is editing this item too. Please coordinate with them so you don't lose your changes.",
  value: "Value",
  values: "Values",
  validation: "Validation",
  version: "Version",
  version_and_updates: "Version and Updates",
  view_type: "View As...",
  write_blacklist: "Write Blacklist",
  write_blacklist_copy: "Select the fields that the user can edit",
  yes: "Yes"
};
