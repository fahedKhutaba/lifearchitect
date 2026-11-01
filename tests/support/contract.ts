import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Ajv } from 'ajv';
import yaml from 'js-yaml';

// The contract is the single source of truth (ADR-0002). Read it, never edit it here.
const CONTRACT_PATH = resolve(import.meta.dirname, '../../packages/contracts/openapi.yaml');

type OpenApiDoc = { components: { schemas: Record<string, object> } };

function loadSchema(name: string): object {
  const doc = yaml.load(readFileSync(CONTRACT_PATH, 'utf8')) as OpenApiDoc;
  const schema = doc.components.schemas[name];
  if (!schema) throw new Error(`Schema "${name}" not found in ${CONTRACT_PATH}`);
  return schema;
}

const ajv = new Ajv({ allErrors: true });

/** Validator for the contract `Health` schema (openapi.yaml, components.schemas.Health). */
export const validateHealth = ajv.compile(loadSchema('Health'));
