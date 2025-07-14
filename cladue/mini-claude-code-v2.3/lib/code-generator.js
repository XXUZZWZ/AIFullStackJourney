const path = require('path');

class CodeGenerator {
  constructor() {
    this.templates = {
      // React 组件模板
      'react-component': {
        extension: '.jsx',
        template: (name) => `import React from 'react';
import PropTypes from 'prop-types';

const ${name} = ({ children, ...props }) => {
  return (
    <div className="${name.toLowerCase()}" {...props}>
      <h2>${name} Component</h2>
      {children}
    </div>
  );
};

${name}.propTypes = {
  children: PropTypes.node
};

${name}.defaultProps = {
  children: null
};

export default ${name};
`
      },

      // React Hook 模板
      'react-hook': {
        extension: '.js',
        template: (name) => `import { useState, useEffect } from 'react';

const ${name} = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Add your effect logic here
  }, [value]);

  const reset = () => {
    setValue(initialValue);
    setError(null);
  };

  return {
    value,
    setValue,
    loading,
    error,
    reset
  };
};

export default ${name};
`
      },

      // Express 路由模板
      'express-route': {
        extension: '.js',
        template: (name) => `const express = require('express');
const router = express.Router();

// GET /${name.toLowerCase()}
router.get('/', async (req, res) => {
  try {
    // Add your GET logic here
    res.json({ message: '${name} route - GET' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /${name.toLowerCase()}
router.post('/', async (req, res) => {
  try {
    // Add your POST logic here
    const { body } = req;
    res.json({ message: '${name} route - POST', data: body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /${name.toLowerCase()}/:id
router.put('/:id', async (req, res) => {
  try {
    // Add your PUT logic here
    const { id } = req.params;
    const { body } = req;
    res.json({ message: '${name} route - PUT', id, data: body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /${name.toLowerCase()}/:id
router.delete('/:id', async (req, res) => {
  try {
    // Add your DELETE logic here
    const { id } = req.params;
    res.json({ message: '${name} route - DELETE', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
`
      },

      // Node.js 模块模板
      'node-module': {
        extension: '.js',
        template: (name) => `class ${name} {
  constructor(options = {}) {
    this.options = {
      debug: false,
      ...options
    };
  }

  /**
   * Main method for ${name}
   */
  async process(data) {
    try {
      if (this.options.debug) {
        console.log('Processing data:', data);
      }

      // Add your processing logic here
      const result = this.transform(data);
      
      return {
        success: true,
        result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Transform data
   */
  transform(data) {
    // Add your transformation logic here
    return data;
  }

  /**
   * Validate input data
   */
  validate(data) {
    if (!data) {
      throw new Error('Data is required');
    }
    return true;
  }
}

module.exports = ${name};
`
      },

      // Python 类模板
      'python-class': {
        extension: '.py',
        template: (name) => `class ${name}:
    """
    ${name} class for handling specific functionality.
    """
    
    def __init__(self, **kwargs):
        """
        Initialize ${name} with optional parameters.
        
        Args:
            **kwargs: Additional keyword arguments
        """
        self.options = kwargs
        self.debug = kwargs.get('debug', False)
    
    def process(self, data):
        """
        Main processing method.
        
        Args:
            data: Input data to process
            
        Returns:
            dict: Result of processing
        """
        try:
            if self.debug:
                print(f"Processing data: {data}")
            
            # Add your processing logic here
            result = self.transform(data)
            
            return {
                'success': True,
                'result': result
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def transform(self, data):
        """
        Transform the input data.
        
        Args:
            data: Data to transform
            
        Returns:
            Transformed data
        """
        # Add your transformation logic here
        return data
    
    def validate(self, data):
        """
        Validate input data.
        
        Args:
            data: Data to validate
            
        Raises:
            ValueError: If data is invalid
        """
        if data is None:
            raise ValueError("Data is required")
        return True

if __name__ == "__main__":
    # Example usage
    instance = ${name}(debug=True)
    result = instance.process("example data")
    print(result)
`
      },

      // Test 文件模板
      'test': {
        extension: '.test.js',
        template: (name) => `const ${name} = require('../${name.toLowerCase()}');

describe('${name}', () => {
  let instance;

  beforeEach(() => {
    instance = new ${name}();
  });

  describe('constructor', () => {
    it('should create an instance with default options', () => {
      expect(instance).toBeInstanceOf(${name});
      expect(instance.options).toBeDefined();
    });

    it('should accept custom options', () => {
      const customInstance = new ${name}({ debug: true });
      expect(customInstance.options.debug).toBe(true);
    });
  });

  describe('process', () => {
    it('should process data successfully', async () => {
      const testData = { test: 'data' };
      const result = await instance.process(testData);
      
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      const result = await instance.process(null);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('transform', () => {
    it('should transform data correctly', () => {
      const testData = { input: 'test' };
      const result = instance.transform(testData);
      
      expect(result).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should validate correct data', () => {
      const testData = { valid: true };
      expect(() => instance.validate(testData)).not.toThrow();
    });

    it('should throw error for invalid data', () => {
      expect(() => instance.validate(null)).toThrow();
    });
  });
});
`
      },

      // Package.json 模板
      'package': {
        extension: '.json',
        template: (name) => `{
  "name": "${name.toLowerCase()}",
  "version": "1.0.0",
  "description": "Generated by Mini Claude Code",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
`
      },

      // README 模板
      'readme': {
        extension: '.md',
        template: (name) => `# ${name}

Generated by Mini Claude Code

## Description

Brief description of the ${name} project.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Features

- Feature 1
- Feature 2
- Feature 3

## API Reference

### Methods

#### \`method1(param)\`

Description of method1.

**Parameters:**
- \`param\` (type): Description of parameter

**Returns:**
- \`type\`: Description of return value

## Testing

\`\`\`bash
npm test
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Generated by

🤖 Mini Claude Code - A simplified AI coding assistant
`
      }
    };
  }

  /**
   * 生成文件
   */
  async generateFile(type, name, projectInfo = null) {
    try {
      // 检测项目类型并调整模板选择
      const detectedType = this.detectFileType(type, projectInfo);
      const template = this.templates[detectedType];

      if (!template) {
        return {
          success: false,
          error: `Template for type '${type}' not found. Available types: ${Object.keys(this.templates).join(', ')}`
        };
      }

      // 规范化名称（PascalCase for classes, camelCase for others）
      const normalizedName = this.normalizeName(name, detectedType);
      
      // 生成内容
      const content = template.template(normalizedName);
      
      // 确定文件路径
      const filePath = this.generateFilePath(detectedType, normalizedName, template.extension, projectInfo);

      return {
        success: true,
        filePath,
        content,
        type: detectedType,
        name: normalizedName
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 根据项目信息检测最合适的文件类型
   */
  detectFileType(userType, projectInfo) {
    const type = userType.toLowerCase();
    
    // 直接匹配
    if (this.templates[type]) {
      return type;
    }

    // 智能映射
    const mappings = {
      'component': 'react-component',
      'comp': 'react-component',
      'hook': 'react-hook',
      'route': 'express-route',
      'router': 'express-route',
      'api': 'express-route',
      'module': 'node-module',
      'class': projectInfo?.languages?.python ? 'python-class' : 'node-module',
      'service': 'node-module',
      'util': 'node-module',
      'helper': 'node-module',
      'test': 'test',
      'spec': 'test',
      'package': 'package',
      'readme': 'readme',
      'doc': 'readme'
    };

    return mappings[type] || 'node-module';
  }

  /**
   * 规范化名称
   */
  normalizeName(name, type) {
    // 移除特殊字符并转换为合适的格式
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '');
    
    if (type.includes('component') || type.includes('class')) {
      // PascalCase for components and classes
      return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    } else if (type.includes('hook')) {
      // camelCase with 'use' prefix for hooks
      const baseName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      return baseName.startsWith('use') ? baseName : `use${baseName}`;
    } else {
      // camelCase for others
      return cleanName.charAt(0).toLowerCase() + cleanName.slice(1);
    }
  }

  /**
   * 生成文件路径
   */
  generateFilePath(type, name, extension, projectInfo) {
    const fileName = name + extension;
    
    // 根据项目结构和类型确定路径
    const pathMappings = {
      'react-component': this.getComponentPath(projectInfo, fileName),
      'react-hook': this.getHookPath(projectInfo, fileName),
      'express-route': this.getRoutePath(projectInfo, fileName),
      'test': this.getTestPath(projectInfo, fileName),
      'package': 'package.json',
      'readme': 'README.md'
    };

    return pathMappings[type] || fileName;
  }

  /**
   * 获取组件路径
   */
  getComponentPath(projectInfo, fileName) {
    const possiblePaths = ['src/components', 'components', 'src'];
    
    if (projectInfo?.structure?.commonDirs) {
      for (const possiblePath of possiblePaths) {
        const parts = possiblePath.split('/');
        if (parts.every(part => projectInfo.structure.commonDirs.includes(part))) {
          return path.join(possiblePath, fileName);
        }
      }
    }
    
    return path.join('src/components', fileName);
  }

  /**
   * 获取 Hook 路径
   */
  getHookPath(projectInfo, fileName) {
    const possiblePaths = ['src/hooks', 'hooks', 'src/utils', 'src'];
    
    if (projectInfo?.structure?.commonDirs) {
      for (const possiblePath of possiblePaths) {
        const parts = possiblePath.split('/');
        if (parts.every(part => projectInfo.structure.commonDirs.includes(part))) {
          return path.join(possiblePath, fileName);
        }
      }
    }
    
    return path.join('src/hooks', fileName);
  }

  /**
   * 获取路由路径
   */
  getRoutePath(projectInfo, fileName) {
    const possiblePaths = ['routes', 'src/routes', 'api/routes', 'src/api'];
    
    if (projectInfo?.structure?.commonDirs) {
      for (const possiblePath of possiblePaths) {
        const parts = possiblePath.split('/');
        if (parts.every(part => projectInfo.structure.commonDirs.includes(part))) {
          return path.join(possiblePath, fileName);
        }
      }
    }
    
    return path.join('routes', fileName);
  }

  /**
   * 获取测试路径
   */
  getTestPath(projectInfo, fileName) {
    if (projectInfo?.structure?.hasTests) {
      const possiblePaths = ['tests', 'test', '__tests__', 'src/__tests__'];
      
      for (const possiblePath of possiblePaths) {
        if (projectInfo.structure.commonDirs.includes(possiblePath.split('/')[0])) {
          return path.join(possiblePath, fileName);
        }
      }
    }
    
    return path.join('tests', fileName);
  }

  /**
   * 列出所有可用的模板
   */
  listTemplates() {
    return Object.keys(this.templates).map(key => ({
      type: key,
      description: this.getTemplateDescription(key)
    }));
  }

  /**
   * 获取模板描述
   */
  getTemplateDescription(type) {
    const descriptions = {
      'react-component': 'React functional component with PropTypes',
      'react-hook': 'Custom React hook with state management',
      'express-route': 'Express.js router with CRUD operations',
      'node-module': 'Node.js class module with error handling',
      'python-class': 'Python class with standard methods',
      'test': 'Jest test file with common test cases',
      'package': 'Package.json with common scripts and dependencies',
      'readme': 'Comprehensive README.md file'
    };

    return descriptions[type] || 'Generic code template';
  }
}

module.exports = CodeGenerator;