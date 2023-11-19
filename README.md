# NewTetris is my version of the popular game, made in JS implementing frontend with HTML, CSS and JavasCript, backend with NodeJS and a database made with mariaDB.

TETRIS API FOR TETRIS WEB APP
VERSION 1.0
Martín Capuano
-----------------------------
This API can be used for any simple game which requires authentication and score register
-----------------------------
ENDPOINTS:
*
    /signup (POST):
        *Registers the user into the database.
        *Body parameters:
            { 
                username: USERNAME, 
                password: PASSWORD
            }
        *Response:
            {
                message: "User Created",
                user_id: USER_ID
            }
        *Username MUST be unique.
*
    /login (POST):
        *Searches the user in database.
        *Body parameters:
            { 
                username: USERNAME, 
                password: PASSWORD
            }
        *Response:
            {
                token: TOKEN,
                user:{
                    id: USER_ID
                    username: USERNAME,
                    password: PASSWORD
                }
            }
*
    /scores (GET):
        *Obtains the 10 highest scores
        *MUST contain the parameter "auth" in the request headers with the user's token provided when logged in.
        *Response:
            [
                {
                    id: ID,
                    user_id: USER_ID,
                    score: SCORE
                }
                .
                .
                .
            ]
*
    /scores/:id (GET)
        *Obtains all the scores with the specified user ID
        *MUST contain the parameter "auth" in the request headers with the user's token provided when logged in.
        *Response:
            [
                {
                    id: ID,
                    user_id: USER_ID,
                    score: SCORE
                }
                .
                .
                .
            ]
*
    /scores (POST):
        *Registers the user's score in the database.
        *MUST contain the parameter "auth" in the request headers with the user's token provided when logged in.
        *Body parameters:
            {
                user_id: USER_ID,
                score: SCORE
            }
        *Response:
            {
                message: "Score Added",
                score_id: SCORE_ID
            }
*
    /scores/:id (DELETE):
        *Deletes ALL the user's scores.
        *MUST contain the parameter "auth" in the request headers with the user's token provided when logged in.
        *Response:
            {
                message: "Scores Deleted",
                deletedScores: DELETED_SCORES
            }

