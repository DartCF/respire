
import falcon


class StudyResource:
    def on_post(self, req, resp):
        """Handle POST requests."""
        search_body = req.media
        # use the search body to query your database

        # YOUR CODE HERE

        # create a list of results
        search_results = [
            {
                'accession_number': 'ID123',  # study unique ID
                'title': 'Study title',  # title of the study
                'description': 'Lorem ipsum dolor sit amet consectitur adipiscing elit',  # description of the study
                'n_samples': 1  # count of available samples
            }
        ]

        resp.media = search_results


class DataResource:
    def on_post(self, req, resp):
        study_id_list = req.media
        # use the study_id_list to query your database
        # YOUR CODE HERE
        # return a FileResponse object with a zip file


class AdminResource:
    def on_get_inputs(self, req, resp):
        """Handle GET requests for inputs."""
        inputs = {
            'inputs': [
                {
                    'function': "checkboxInput",
                    'searchField': "has_data",
                    'split_download': False,
                    'args': {
                        'label': "Has data?",
                        'checked': True
                    }
                },
                {
                    'function': "textInput",
                    'searchField': "search_string",
                    'split_download': False,
                    'args': {
                        'label': "Search terms",
                        'placeholderText': "Enter one or more search terms"
                    }
                }
            ]
        }

        resp.media = inputs

    def on_get_dataStructure(self, req, resp):
        """Handle GET requests for dataStructure."""
        data_structure = {
            'study_metadata_table': {
                'db_schema': 'public',
                'table': 'studies',
                'fields': [{"accession_number": "character"}]
            },
            'sample_metadata_table': {
                'db_schema': 'public',
                'table': 'samples',
                'fields': [{'accession_number': 'character'}]
            },

            'data_table': {
                'db_schema': 'public',
                'table': 'data',
                'fields': [{'accession_number': 'character'}]
            },
            'shared_key': 'accession_number'
        }
        resp.media = data_structure


app = falcon.App()
app.add_route('/admin/inputs', AdminResource(), suffix='inputs')
app.add_route('/admin/dataStructure', AdminResource(), suffix='dataStructure')
app.add_route('/studies/searchMetadata', StudyResource())
app.add_route('/data/download', DataResource())
