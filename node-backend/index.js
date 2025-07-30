// ...existing code...
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb+srv://marupalliaashritha:q7xN6qfRx4Jt_zC@cluster0.zsswfqo.mongodb.net/imdb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const movieSchema = new mongoose.Schema({
  Ids: Number,
  Title: String,
  Description: String,
  Year: Number,
  Runtime: Number,
  Rating: Number,
  Votes: Number,
  Revenue: Number,
  Actors: [String],
  Genre: [String],
  Director: [String],
});

const Movie = mongoose.model('Movie', movieSchema, 'Movies');

// GraphQL type definitions
const typeDefs = gql`
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
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    movies: async (_, args) => {
      const filter = {};
      if (args.Title) filter.Title = args.Title;
      if (args.Year) filter.Year = args.Year;
      if (args.Genre) filter.Genre = { $in: [args.Genre] };
      if (args.Rating) filter.Rating = args.Rating;
      if (args.Votes) filter.Votes = args.Votes;
      if (args.Revenue) filter.Revenue = args.Revenue;
      if (args.Actors) filter.Actors = { $in: [args.Actors] };
      if (args.Director) filter.Director = { $in: [args.Director] };
      return await Movie.find(filter);
    },
    movie: async (_, args) => {
      const filter = {};
      if (args.Title) filter.Title = args.Title;
      if (args.Year) filter.Year = args.Year;
      if (args.Genre) filter.Genre = { $in: [args.Genre] };
      if (args.Rating) filter.Rating = args.Rating;
      if (args.Votes) filter.Votes = args.Votes;
      if (args.Revenue) filter.Revenue = args.Revenue;
      if (args.Actors) filter.Actors = { $in: [args.Actors] };
      if (args.Director) filter.Director = { $in: [args.Director] };
      return await Movie.findOne(filter);
    },
    movieCount: async (_,args) =>{
       const filter = {};
      if (args.Title) filter.Title = args.Title;
      if (args.Year) filter.Year = args.Year;
      if (args.Genre) filter.Genre = { $in: [args.Genre] };
      if (args.Rating) filter.Rating = args.Rating;
      if (args.Votes) filter.Votes = args.Votes;
      if (args.Revenue) filter.Revenue = args.Revenue;
      if (args.Actors) filter.Actors = { $in: [args.Actors] };
      if (args.Director) filter.Director = { $in: [args.Director] };
      return await Movie.find(filter).countDocuments();
    }
  },
  Mutation: {
    createMovie: async (_, { input }) => {
      const movie = new Movie(input);
      await movie.save();
      return movie;
    },
    updateMovie: async (_, { Title, input }) => {
      const movie = await Movie.findOneAndUpdate(
        { Title },
        input,
        { new: true }
      );
      return movie;
    },
    deleteMovie: async (_, { Title }) => {
      const result = await Movie.deleteOne({ Title });
      return result.deletedCount > 0;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
// ...existing code...
