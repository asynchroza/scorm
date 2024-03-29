# Scorm Player

![Landing page](images/scorm_landing_page.png)

## How to run

### Prerequisites

* Publicly accessible S3 Bucket
* Docker

### Commands

* `bun dev` to start the server locally
* `bun proxy:start` to start the reverse proxy
* `bun db:push` to push the schema
* `bun db:start` to start the database

### Reverse proxy

In order to avoid cross origin issues when loading iframes, we have to proxy the requests.

![Scorm package is missing required files](images/missing_required_files.png)
![Manifest couldn't be parsed](images/manifest_couldnt_be_parsed.png)