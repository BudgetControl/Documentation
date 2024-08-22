---
sidebar_position: 1
---

To access the BudgetControl APIs, you must authenticate your requests using your user login credentials. Authentication is performed by sending a request to the /api/auth/authenticate endpoint with your email and password.

### Development Credentials
If you need development credentials for testing purposes, you can obtain them by creating an account in the [DEV ENVIROMENT](https://dev.app.budgetcontrol.cloud/)

## Auth Request Example
Below is an example of how to authenticate using a curl request:

- Request
```
curl --location 'https://dev.app.budgetcontrol.cloud/api/auth/authenticate' \
--header 'Accept: application/json, text/plain, */*' \
--header 'Content-Type: application/json' \
--data-raw '{"email":"YOUR_EMAIL_USER","password":"YOUR_PASSWORD"}'
```

Replace YOUR_EMAIL_USER and YOUR_PASSWORD with your actual login credentials.

- Response:

```
{
    "success": true,
    "message": "User authenticated",
    "token": "THE AUTH TOKEN HERE",
    "workspaces": [
        {
            "uuid": "f52d6d1d-ed59-1234-bc20-example",
            "name": "Family",
            "description": null,
            "current": 0,
            "created_at": "2024-04-26T10:05:58.000000Z",
            "updated_at": "2024-07-05T09:22:50.000000Z",
            "deleted_at": null,
            "user_id": 1
        },
        {
            "uuid": "2c403243-2222-43b8-99ee-example",
            "name": "Savings",
            "description": null,
            "current": 0,
            "created_at": "2024-05-15T14:25:44.000000Z",
            "updated_at": "2024-08-20T15:34:05.000000Z",
            "deleted_at": null,
            "user_id": 1
        }
    ]
}
```

## Accessing User Information After Authentication
After successfully authenticating, you need to call the /api/auth/user-info endpoint to retrieve important user details, including the *X-Bc-Token* needed for subsequent API requests. This token should be included in the *X-Bc-Token* header of all future API calls.

### How to Call the user-info Endpoint
To make this request, pass your bearer auth token in the Authorization header. Here’s an example of how to structure your request:

Request Example:

```
curl --location 'https://dev.app.budgetcontrol.cloud/api/auth/user-info' \
--header 'Accept: application/json, text/plain, */*' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_AUTH_TOKEN'
```
Replace YOUR_AUTH_TOKEN with the actual token you received during authentication.

### Response Structure

The response from the user-info endpoint will include the following information:

- token: Use this token for the X-Bc-Token header in all authenticated API requests.
- userInfo: Contains details about the authenticated user.
- current_ws: The UUID of the current default user workspace.
- workspace_settings: Configuration settings for the current workspace.
- shared_with: A list of users with whom the current workspace is shared.

Example Response:


Example:
```
{
    "token": "token",
    "userInfo": {
        "uuid": "65ba811aabd8a-example",
        "name": "bar",
        "email": "bar890@gmail.com",
        "email_verified_at": "2024-01-31T18:19:44.000000Z",
        "created_at": "2024-01-31T18:19:22.000000Z",
        "updated_at": "2024-06-21T20:34:10.000000Z",
        "deleted_at": null,
        "sub": "3df00db8-d946-412f-8a06-example",
        "workspaces": [
            {
                "id": 20,
                "uuid": "2c403243-4a94-43b8-99ee-example",
                "name": "Savings",
                "description": null,
                "current": 0,
                "created_at": "2024-05-15 15:20:12",
                "updated_at": "2024-05-15 15:20:12",
                "deleted_at": null,
                "user_id": 1,
                "workspace_id": 7
            },
            {
                "id": 21,
                "uuid": "f52d6d1d-ed59-4682-bc20-example",
                "name": "Family",
                "description": null,
                "current": 0,
                "created_at": "2024-05-15 15:20:29",
                "updated_at": "2024-05-15 15:20:29",
                "deleted_at": null,
                "user_id": 1,
                "workspace_id": 1
            },
            {
                "id": 33,
                "uuid": "45cefff6-51f1-48f5-83c6-example",
                "name": "Foo",
                "description": null,
                "current": 1,
                "created_at": "2024-06-17 17:24:42",
                "updated_at": "2024-06-17 17:24:42",
                "deleted_at": null,
                "user_id": 1,
                "workspace_id": 6
            }
        ],
        "current_ws": "f52d6d1d-ed59-4682-bc20-example",
        "workspace_settings": {
            "id": 1,
            "workspace_id": 1,
            "setting": "app_configurations",
            "data": "{\"currency_id\": 2, \"payment_type_id\": 1}",
            "created_at": null,
            "updated_at": null,
            "deleted_at": null
        },
        "shared_with": [
            {
                "email": "foo@gmail.com",
                "name": "Foo"
            },
            {
                "email": "bar@gmail.com",
                "name": "bar"
            }
        ]
    }
}
```

### Notes
- token: Use this value as the X-Bc-Token header for all subsequent API calls to ensure authentication.
- userInfo: Provides personal information and user details.
- current_ws: Indicates the default workspace that is currently active.
- workspace_settings: Contains configuration settings for the current workspace, such as currency and payment methods.
- shared_with: Lists users who have access to the current workspace.

By using the information obtained from this endpoint, you can effectively interact with the BudgetControl API, ensuring secure and personalized access to your data.


## Making API Requests
After successfully authenticating, you will receive an authorization token. This token is essential for accessing protected endpoints within the BudgetControl API. You must include this token in both the Authorization and X-Bc-Token headers of all subsequent API requests. Additionally, the X-Bc-Ws header should be used to specify the workspace ID.

#### Example Request
Here is an example of how to make an authenticated request using curl:

```
curl --location 'https://dev.app.budgetcontrol.cloud/api/some-endpoint' \
--header 'Accept: application/json, text/plain, */*' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer THE_AUTH_TOKEN_HERE' \
--header 'X-Bc-Token: THE_AUTH_TOKEN_HERE' \
--header 'X-Bc-Ws: WORKSPACE_ID'

```

Replace the placeholders with the following:
- THE_AUTH_TOKEN_HERE: The authorization token you received from the authentication response.
- WORKSPACE_ID: The ID of the workspace you are working with.

#### Notes
- Authorization Header: Use the Bearer token format to include your authorization token.
- X-Bc-Token Header: This header should also contain the same token for additional security.
- X-Bc-Ws Header: This header specifies the workspace ID to ensure that the API request is directed to the correct workspace context.
- By including these headers in your requests, you ensure secure and authorized access to the BudgetControl API, allowing you to interact with protected endpoints effectively.