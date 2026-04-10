import type { RequestDocument } from "graphql-request";
import type { QueryParams } from "../client/types";
import { SynthError } from "../errors";

type GraphQLArgType = "EthAddress!" | "IntentStatus" | "Int" | "Boolean";

interface GraphQLOperationArgConfig {
  argumentName: string;
  required?: boolean;
  type: GraphQLArgType;
  variableName: string;
}

interface GraphQLOperationConfig {
  args: GraphQLOperationArgConfig[];
  dataPath: string;
  defaultSelection: string[];
  fieldName: string;
}

const operationMap: Record<string, GraphQLOperationConfig> = {
  userIntents: {
    fieldName: "userIntents",
    dataPath: "userIntents",
    args: [
      {
        variableName: "user",
        argumentName: "user",
        type: "EthAddress!",
        required: true,
      },
      {
        variableName: "status",
        argumentName: "status",
        type: "IntentStatus",
      },
      {
        variableName: "limit",
        argumentName: "limit",
        type: "Int",
      },
      {
        variableName: "offset",
        argumentName: "offset",
        type: "Int",
      },
      {
        variableName: "fresh",
        argumentName: "fresh",
        type: "Boolean",
      },
    ],
    defaultSelection: [
      "id",
      "user",
      "createdTxHash",
      "createdBlock",
      "updatedBlock",
      "createdAt",
      "updatedAt",
      "tokenFrom",
      "tokenTo",
      "amount",
      "priceThreshold",
      "status",
      "expiration",
    ],
  },
};

function getOperationConfig(resource: string): GraphQLOperationConfig {
  const config = operationMap[resource];

  if (!config) {
    throw new SyntaxError(`Unsupported GraphQL resources: ${resource}`);
  }

  return config;
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null;
}

function buildVariableDefinitions(
  config: GraphQLOperationConfig,
  params?: QueryParams
) {
  const definitions: string[] = [];

  for (const arg of config.args) {
    const value = params?.[arg.variableName as keyof QueryParams];

    if (arg.required || hasValue(value)) {
      definitions.push(`$${arg.variableName}: ${arg.type}`);
    }
  }

  return definitions.join(", ");
}

function buildFieldArguments(
  config: GraphQLOperationConfig,
  params?: QueryParams
) {
  const argumentsList: string[] = [];

  for (const arg of config.args) {
    const value = params?.[arg.variableName as keyof QueryParams];

    if (arg.required || hasValue(value)) {
      argumentsList.push(`${arg.argumentName}: $${arg.variableName}`);
    }
  }

  if (argumentsList.length === 0) {
    return "";
  }

  return `(${argumentsList.join(", ")})`;
}

function buildSelectionSet(select?: string[], fallback: string[] = []) {
  const fields = select && select.length > 0 ? select : fallback;

  if (fields.length === 0) {
    throw new SynthError("GraphQL selection set cannot be empty");
  }

  return fields.map((field) => `    ${field}`).join("\n");
}

export function buildGraphQLQuery(
  resource: string,
  params?: QueryParams
): RequestDocument {
  const config = getOperationConfig(resource);
  const variableDefinitions = buildVariableDefinitions(config, params);
  const fieldArguments = buildFieldArguments(config, params);
  const selectionSet = buildSelectionSet(
    params?.select,
    config.defaultSelection
  );

  const queryHeader = variableDefinitions
    ? `query SynthQuery(${variableDefinitions})`
    : "query SynthQuery";

  return `
  ${queryHeader} {
    ${config.fieldName}${fieldArguments} {
  ${selectionSet}
    }
  }
  `.trim();
}

export function buildGraphQLVariables(resource: string, params?: QueryParams) {
  const config = getOperationConfig(resource);
  const variables: Record<string, unknown> = {};

  for (const arg of config.args) {
    const value = params?.[arg.variableName as keyof QueryParams];

    if (arg.required) {
      if (!hasValue(value)) {
        throw new SynthError(
          `Missing required GraphQL variable: ${arg.variableName}`
        );
      }

      variables[arg.variableName] = value;
      continue;
    }

    if (hasValue(value)) {
      variables[arg.variableName] = value;
    }
  }

  return variables;
}

export function getGraphQLDataPath(resource: string) {
  return getOperationConfig(resource).dataPath;
}
