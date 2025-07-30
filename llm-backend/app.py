import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.llms import Ollama
from langchain.prompts import PromptTemplate

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

# Apollo Server GraphQL endpoint
GRAPHQL_URL = "http://localhost:4000/"

# GraphQL schema (for prompt context)
GRAPHQL_SCHEMA = """
type Movie {
  _id: ID!
  Ids: Int
  Title: String
  Description: String
  Year: Int
  Runtime: Int
  Rating: Float
  Votes: Int
  Revenue: Float
  Actors: [String]
  Genre: [String]
  Director: [String]
}
input MovieInput {
  Ids: Int
  Title: String
  Description: String
  Year: Int
  Runtime: Int
  Rating: Float
  Votes: Int
  Revenue: Float
  Actors: [String]
  Genre: [String]
  Director: [String]
}
type Query {
  movies(
    Title: String,
    Year: Int,
    Genre: String,
    Rating: Float,
    Votes: Int,
    Revenue: Float,
    Actors: String,
    Director: String
  ): [Movie]
  movie(
    Title: String,
    Year: Int,
    Genre: String,
    Rating: Float,
    Votes: Int,
    Revenue: Float,
    Actors: String,
    Director: String
  ): Movie
  movieCount(
      Title: String,
      Year: Int,
      Genre: String,
      Rating: Float,
      Votes: Int,
      Revenue: Float,
      Actors: String,
      Director: String
    ): Int
}
type Mutation {
  createMovie(input: MovieInput!): Movie
  updateMovie(Title: String!, input: MovieInput!): Movie
  deleteMovie(Title: String!): Boolean
}
"""

# LangChain Ollama LLM
llm = Ollama(model="Gemma")

# Prompt template for NL to GraphQL
PROMPT_TEMPLATE = PromptTemplate(
    input_variables=["schema", "user_input"],
    template="""You are a precise assistant that converts natural language requests into valid GraphQL queries or mutations.

## SCHEMA
{schema}

## RULES
- Only return valid GraphQL syntax.
- ONLY return the query or mutation, nothing else.
- USE "movieCount" query if I have asked for how many or count of movies.
- If a mutation or query returns an object type (e.g., Movie), you MUST include a selection set.
- If a mutation or query returns a scalar type (e.g., Boolean, Int), DO NOT include a selection set.- DO NOT omit selection sets.
- DO NOT return explanations or text — only output the GraphQL query or mutation.
- If the user input is invalid or cannot be converted, return an empty string.
- PLEASE understand the schema, return types and use it to construct the query or mutation.
- WHEN querying for a single object, use the `movie` query.
- WHEN queying if user did not specify a field, use the `movies` query with appropriate filters. If no filters are provided, return all movies.
- PLEASE understand the mutation returns an object type.
- WHEN creating or updating a movie, few propeties are of array type( Genre, Director, Actors) , so you must handle them accordingly.
- IF the movie title or name is not provided. Do not fill it with any value

## USER INPUT
{user_input}

## EXAMPLES

❌ INVALID:
mutation {{
  createMovie(input: {{   }})
}}

✅ VALID:
mutation {{
  createMovie(input: {{  }}) {{
    _id
    Title
    Description
    Year
    Runtime
    Rating
    Votes
    Revenue
    Actors
    Genre
    Director
  }}
}}

mutation {{
  updateMovie(Title: "Hulk", input: {{
    Title: "Hulk",
    Rating: 4.9
  }}) {{
    _id
    Title
    Description
    Year
    Runtime
    Rating
    Votes
    Revenue
    Actors
    Genre
    Director
  }}
}}

mutation {{
  deleteMovie(input: {{ Title: "Dora" }})
}}

## OUTPUT
"""
)

@app.route("/nlq", methods=["POST"])
def nlq():
    data = request.get_json()
    user_input = data.get("input", "")
    prompt = PROMPT_TEMPLATE.format(user_input=user_input, schema=GRAPHQL_SCHEMA)
    graphql_query = llm(prompt)
    # Clean up response if needed
    graphql_query = graphql_query.strip()
    # Send to Apollo Server
    response = requests.post(
        GRAPHQL_URL,
        json={"query": graphql_query}
    )
    result = response.json()
    return jsonify({"graphql": graphql_query, "result": result})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
