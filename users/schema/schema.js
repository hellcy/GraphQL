const graphql = require("graphql");
const _ = require("lodash");

/**
 * The schema file communicates all the different types of data in our application over to graphQL
 * and tells GraphQL how they are related
 */

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

/**
 * some hardcoded data
 */
const users = [
  { id: "23", firstName: "Bill", age: 20 },
  { id: "47", firstName: "Sam", age: 21 },
];

/**
 * We define the UserType, each User should have 3 properties: id, firstName and age
 */
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

/**
 * RootQuery is the entry point of a GraphQL query
 * it is to allow GraphQL to jump and land on a very specific node in the database
 * In this case, we are passing an id in our RootQuery, and we are expecting it to return a User
 * The resolve function is to actually execute our RootQuery and will return the User we want
 */
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return _.find(users, { id: args.id });
      },
    },
  },
});

/**
 * GraphQLSchema takes a RootQuery and returns a new instance of GraphQL Schema
 * we can use this schema in our Express application
 */
module.exports = new GraphQLSchema({
  query: RootQuery,
});
