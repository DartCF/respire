# respire

RESPIRE is the REpoSitory for Pulmonary expressIon data Reuse

## Project Goal

The goal of the RESPIRE project is to provide a simple interface to a wide variety of microbiological data types. Sourcing clean, analysis-ready data is one of the primary challenges to "multi-omics" (i.e. from multiple "omes" -- the genome, proteome, microbiome, metabolome, etc.) data analysis. RESPIRE provides a standard interface for exposing processed data for download with the goal of increasing the reusability and availability of said data.

This is accomplished through a dynamic front-end and modular application structure that makes it easy for researchers to expose an API with a standard specification to a deployed RESPIRE instance and make data immediately available to the community.

# The RESPIRE System

The RESPIRE system has three pieces

1. One or more module APIs that serve data and metadata specific to a module (e.g. gene expression data, microbiome data) 
2. A registry API that tracks the available modules and makes them known to the front-end application
3. A standard React front end set up to consume data from the registry and module APIs

![System Architecture](images/respire_system_architecture.png)


# Deploying a new RESPIRE instance

Module APIs are registered with a deployed registry API, which is in turn connected to a RESPIRE frontend instance. Both the registry API and the front-end are containerized using Docker. These containers can be deployed on AWS or on your institution's infrastrucure.

# Developing a new module

RESPIRE Modules combine searchable metadata with processed data and a standard API interface that can be registered with a hosted RESPIRE frontend.

The RESPIRE frontend is designed to search __study level metadata__ and select studies based on one or more filters. These studies are associated with __samples__ which comprise the data and may have metadata of their own.

## Data requirements

Two types of data are required for a functional RESPIRE module:

1. Study Metadata: This information describes studies having one or more samples. This information is used by the front end to identify studies of interest to the researcher.
2. Data: This is the information associated with the studies searchable through the front end. How this data is processed and stored is at the discretion of the module developer.

Additionally, __sample metadata__ is strongly recommended but not required for the system to operate. This is information that describes the samples present in the data.



# Developing a new module API 

A module API has four required endpoints

- `/studies/searchMetadata` : Returns study results matching the search from the front end
- `/data/download` : Returns a FileResponse containing the selected studies
- `/admin/inputs` : Returns a list of JSON objects defining one or more inputs for the front end
- `/admin/dataStructure` : Returns a JSON object describing the module data structure. Required only to use the module with the `respireAdmin` R package

Additional end points, such as to provide lists of options for dropdown menus or other desired administrative functions, can be added as necessary.

## Required Endpoints

_______________________

## /studies

### /searchMetadata  [POST]

__Purpose:__ Search __study metadata__ and return information about studies matching the search.

__Accepts:__
Arbitrary JSON defined by `/admin/inputs`

See the section on `/admin/inputs` for more information on how the JSON is created and served from the front end.

__Returns:__

List of results with the following structure.

    [{ 

      accession_number: [NUM/STR] Unique ID for study
  
      title: [STR]
  
      description: [STR]
  
      n_samples: [NUM]
  
    }]

_______________________

## /data

### /download  [POST]

__Purpose:__ Download data and metadata matching selected studies in a .ZIP file. The exact structure of the data and contents of the ZIP are at the discretion of the module developer.

__Accepts:__

List of unique ID values

__Returns:__

FileResponse

    headers = {'Content-Disposition': 'attachment; filename="YOURFILENAMEHERE.zip"',
               'Accept': 'application/zip, application/octet-stream '}

_______________________

## /admin

### /inputs [GET]

__Purpose:__ RESPIRE modules are intended to handle diverse types of data. `/admin/inputs` returns a list of input specifications for a module that will be drawn dynamically by the user interface. This endpoint determines the choices the end-user will have for searching the study metadata.

__Returns:__

A hash with one key, `inputs`. The value of inputs will be an array of JSON objects

{inputs: List[Dict]}

#### Valid Inputs

An input definition is a JSON with 4 keys

    {
      function: FUNCTION_NAME,
      searchField: FIELD_NAME,
      split_download: true/false
      args: {
        ARG_NAME: ARG_VALUE
        }
    }

- function
  - Valid pre-defined input function, one of checkboxInput, textInput, selectInput, or numberInput
- searchField
  - Corresponds to a field accepted by /studies/searchMetadata
- split_download
  - A boolean `true`/`false`. If `true`, data will be downloaded separately for each selected value of the input. This is intended to prevent non-sensical combinations of data, such as combining data sourced from multiple profiling methods into a single compendium.
  - If multiple `true` split_download values are provided, downloads will be possible for all combinations of the marked inputs.
- args
  - Arguments specific to the function. Required args detailed below

The values provided in the `searchField` of each input will be extracted into a JSON object defining that will be passed to `/studies/searchMetadata` when a search is submitted. For example, given the following input collection:

    inputs: [
      {
        function: checkboxInput,
        searchField: has_data,
        split_download: false,
        args: {
          label: "Data available?"
          }
      },
      {
        function: numberInput,
        searchField: "min_samples",
        split_download: false,
        args: {
          label: "Minimum available samples",
          defaultValue: 50
          }
      }]

The RESPIRE interface will pass the following JSON structure to `/studies/searchMetadata` (with values corresponding to the user selection)

    {
     "has_data": true,
     "min_samples": 50
    }

#### Input Functions

- checkboxInput
  - args
    - label: Text to display as the label
- textInput
  - args
    - label: Text to display as the label
    - placeholderText: Text to display as a placeholder
- selectInput
  - args
    - label: Text to display as the label
    - options: Optional list of values to choose from
    - source: An optional API endpoint to use to populate choices. If `source` is not null, anything specified in `options` will be overwritten
- numberInput
  - args
    - label: Text to display as the label
    - defaultValue: Initial value for the input

### /dataStructure [GET]

__Purpose:__ This endpoint describes the database structure of the study metadata, data, and optional sample metadata. This endpoint is used by the `respireAdmin` R package.

__Returns:__

JSON

```
    {
            'study_metadata_table': {
                'db_schema': '',
                'table': '',
                'fields': [{FIELD_NAME: FIELD_TYPE}]
            },
            'sample_metadata_table': {
                'db_schema': '',
                'table': '',
                'fields': [{FIELD_NAME: FIELD_TYPE}]
            },
                        
            'data_table': {
                'db_schema': '',
                'table': '',
                'fields': [{FIELD_NAME: FIELD_TYPE}]
            },
            'shared_key': SHARED_ID
        }
```

The `sample_metadata_table` key is optional. All other keys are required.

#### study_metadata_table

The specification of the database table containing study metadata

- db_schema: The database schema containing the table
- table: The name of the table
- fields: A list of field names and field types
  - Field types must be one of:
    - integer
    - numeric
    - character
    - boolean

#### sample_metadata_table

The specification of the database table containing sample metadata

- db_schema: The database schema containing the table
- table: The name of the table
- fields: A list of field names and field types
  - Field types must be one of:
    - integer
    - numeric
    - character
    - boolean

#### data_table

The specification of the database table containing the data for the studies

- db_schema: The database schema containing the table
- table: The name of the table
- fields: A list of field names and field types
  - Field types must be one of:
    - integer
    - numeric
    - character
    - boolean

#### shared_key

The study metadata table and the data table should share a key that can be used to identify the data for a study. `shared_key` should be the name of that column.

### Register the module API with the registry API

This can be done with the `respireAdmin` package's `register_new_module()` function or with a post request to your registry API's `register_module` endpoint.

A module specification is formed as follows:

- module_name: A unique, descriptive name for the module. This will appear in a dropdown, so one or two words is best.
- module_api: The base URL for the module API

