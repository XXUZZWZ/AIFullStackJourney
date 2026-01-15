/**
 * Base Tool Class
 * All tools extend this class
 */

export class BaseTool {
  constructor(name, description, inputSchema) {
    this.name = name;
    this.description = description;
    this.inputSchema = inputSchema;
  }

  /**
   * Get the schema for Claude API
   * @returns {object} Tool schema
   */
  get schema() {
    return {
      name: this.name,
      description: this.description,
      input_schema: this.inputSchema
    };
  }

  /**
   * Validate input parameters
   * @param {object} input - Input to validate
   * @returns {object} Validation result
   */
  validate(input) {
    const required = this.inputSchema.required || [];

    for (const field of required) {
      if (!(field in input)) {
        return {
          valid: false,
          error: `Missing required parameter: ${field}`
        };
      }
    }

    return { valid: true };
  }

  /**
   * Execute the tool - must be implemented by subclasses
   * @param {object} input - Tool input
   * @returns {Promise<object>} Execution result
   */
  async execute(input) {
    throw new Error('execute() must be implemented by subclass');
  }
}
