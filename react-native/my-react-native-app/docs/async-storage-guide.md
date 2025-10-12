# React Native Async Storage 使用指南

## 概述

Async Storage 是 React Native 的一个简单的、异步的、持久化的键值存储系统。它用于在设备上存储小量的数据，如用户设置、应用状态等。

## 安装

```bash
npm install @react-native-async-storage/async-storage
```

对于 iOS，还需要运行：
```bash
cd ios && pod install
```

## 基本用法

### 1. 导入 Async Storage

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### 2. 存储数据

```javascript
// 存储字符串
const storeData = async (value) => {
  try {
    await AsyncStorage.setItem('@storage_Key', value);
  } catch (e) {
    // 保存错误
  }
};

// 存储对象（需要先转换为字符串）
const storeObject = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@storage_Key', jsonValue);
  } catch (e) {
    // 保存错误
  }
};
```

### 3. 读取数据

```javascript
// 读取字符串
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@storage_Key');
    if (value !== null) {
      // 值先前已存储
      return value;
    }
  } catch (e) {
    // 读取错误
  }
};

// 读取对象
const getObject = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // 读取错误
  }
};
```

### 4. 删除数据

```javascript
// 删除单个键
const removeValue = async () => {
  try {
    await AsyncStorage.removeItem('@storage_Key');
  } catch (e) {
    // 删除错误
  }
};

// 清除所有数据
const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // 清除错误
  }
};
```

## 高级用法

### 1. 多键操作

```javascript
// 存储多个键值对
const storeMultiple = async () => {
  try {
    await AsyncStorage.multiSet([
      ['@MyApp_user', 'user1'],
      ['@MyApp_key', 'value']
    ]);
  } catch (e) {
    // 保存错误
  }
};

// 读取多个键
const getMultiple = async () => {
  try {
    const values = await AsyncStorage.multiGet(['@MyApp_user', '@MyApp_key']);
    return values;
  } catch (e) {
    // 读取错误
  }
};

// 删除多个键
const removeMultiple = async () => {
  try {
    await AsyncStorage.multiRemove(['@MyApp_user', '@MyApp_key']);
  } catch (e) {
    // 删除错误
  }
};
```

### 2. 获取所有键

```javascript
const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (e) {
    // 读取错误
  }
};
```

### 3. 合并数据

```javascript
const mergeItem = async () => {
  try {
    // 假设当前存储的是 {"name": "John", "age": 30}
    await AsyncStorage.mergeItem('@MyApp_user', JSON.stringify({
      age: 31,
      city: 'New York'
    }));
    // 结果将是 {"name": "John", "age": 31, "city": "New York"}
  } catch (e) {
    // 合并错误
  }
};
```

## 实际应用示例

### 用户登录状态管理

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [user, setUser] = useState(null);

  // 检查登录状态
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      if (userData !== null) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('读取用户数据失败:', error);
    }
  };

  const login = async () => {
    const userData = {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com'
    };

    try {
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('保存用户数据失败:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user_data');
      setUser(null);
    } catch (error) {
      console.error('删除用户数据失败:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {user ? (
        <>
          <Text>欢迎, {user.name}!</Text>
          <Button title="退出登录" onPress={logout} />
        </>
      ) : (
        <Button title="登录" onPress={login} />
      )}
    </View>
  );
};

export default App;
```

### 应用设置存储

```javascript
// settings.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsManager = {
  // 保存设置
  saveSettings: async (settings) => {
    try {
      await AsyncStorage.setItem('@app_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  },

  // 获取设置
  getSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem('@app_settings');
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('获取设置失败:', error);
      return null;
    }
  },

  // 清除所有设置
  clearSettings: async () => {
    try {
      await AsyncStorage.removeItem('@app_settings');
    } catch (error) {
      console.error('清除设置失败:', error);
    }
  }
};
```

## 最佳实践

1. **错误处理**: 始终使用 try-catch 块包装 Async Storage 操作
2. **数据验证**: 在读取数据时验证数据的有效性
3. **键命名**: 使用有意义的键名，并考虑添加前缀避免冲突
4. **数据类型**: 记住 Async Storage 只能存储字符串，对象需要序列化
5. **性能**: 避免频繁的存储操作，批量处理相关数据

## 限制和注意事项

- Async Storage 不是加密的，不适合存储敏感信息
- 存储大小有限制（通常为 6MB，但可能因平台而异）
- 对于大量数据，考虑使用 SQLite 或其他数据库解决方案
- 在 Web 环境中，Async Storage 使用 localStorage

## 调试技巧

```javascript
// 调试函数：打印所有存储的键值对
const debugStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(keys);
    console.log('当前存储的数据:', stores);
  } catch (error) {
    console.error('调试存储失败:', error);
  }
};
```

这个指南应该能帮助你开始使用 React Native Async Storage。根据你的具体需求，可以进一步扩展这些示例。