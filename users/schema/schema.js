const graphql = require("graphql");
const axios = require("axios");

/**
 * The schema file communicates all the different types of data in our application over to graphQL
 * and tells GraphQL how they are related
 */

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = graphql;

/**
 * CompanyType schema, it has 3 properties: id, name and description
 */
const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((response) => response.data);
      },
    },
  }),
});

/**
 * UserType schema, each User should have 3 properties: id, firstName and age
 */
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((response) => response.data);
      },
    },
  }),
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
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((response) => response.data);
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((response) => response.data);
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
