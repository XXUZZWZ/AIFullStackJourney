import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Alert
} from 'react-native';

import {
  Provider as PaperProvider,
  TextInput,
  Button,
  Checkbox,
  List,
  Text,
  useTheme
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// 存储键名常量
const STORAGE_KEYS = {
  TODOS: '@todo_app_todos'
};

export default function App(){
  const [task, setTask] = useState("")
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const theme = useTheme()

  // 加载存储的待办事项
  useEffect(() => {
    loadTodos();
  }, []);

  // 当 todos 变化时自动保存
  useEffect(() => {
    if (!isLoading) {
      saveTodos();
    }
  }, [todos, isLoading]);

  // 加载待办事项
  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEYS.TODOS);
      if (storedTodos !== null) {
        const parsedTodos = JSON.parse(storedTodos);
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error('加载待办事项失败:', error);
      Alert.alert('错误', '加载待办事项失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 保存待办事项
  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    } catch (error) {
      console.error('保存待办事项失败:', error);
      Alert.alert('错误', '保存待办事项失败');
    }
  };

  // 清除所有待办事项
  const clearAllTodos = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TODOS);
      setTodos([]);
      Alert.alert('成功', '所有待办事项已清除');
    } catch (error) {
      console.error('清除待办事项失败:', error);
      Alert.alert('错误', '清除待办事项失败');
    }
  };

  // 确认清除所有待办事项
  const confirmClearAll = () => {
    if (todos.length === 0) {
      Alert.alert('提示', '没有待办事项可清除');
      return;
    }

    Alert.alert(
      '确认清除',
      '确定要清除所有待办事项吗？此操作不可撤销。',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: clearAllTodos, style: 'destructive' }
      ]
    );
  };

  const addTodo = () => {
    if (task.trim() === "") {
      Alert.alert("提示", "请输入待办事项")
      return
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: task,
      completed: false
    }

    setTodos([...todos, newTodo])
    setTask("")
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const renderTodo = ({ item }: { item: Todo }) => (
    <List.Item
      title={item.text}
      left={props => (
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => toggleTodo(item.id)}
        />
      )}
      right={props => (
        <Button
          mode="outlined"
          onPress={() => deleteTodo(item.id)}
          style={{ marginRight: 8 }}
        >
          删除
        </Button>
      )}
      titleStyle={item.completed ? { textDecorationLine: 'line-through', color: '#666' } : {}}
    />
  )

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          待办事项
        </Text>

        {/* 统计信息 */}
        {!isLoading && (
          <View style={styles.statsContainer}>
            <Text variant="bodyMedium" style={styles.statsText}>
              总计: {todos.length} | 已完成: {todos.filter(todo => todo.completed).length}
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            label="添加待办事项"
            value={task}
            onChangeText={setTask}
            style={styles.input}
            mode="outlined"
            disabled={isLoading}
          />
          <Button
            mode="contained"
            onPress={addTodo}
            style={styles.addButton}
            disabled={isLoading}
          >
            添加
          </Button>
        </View>

        {/* 操作按钮 */}
        {todos.length > 0 && (
          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              onPress={confirmClearAll}
              style={styles.clearButton}
              disabled={isLoading}
            >
              清除所有
            </Button>
          </View>
        )}

        {/* 加载状态 */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text variant="bodyMedium">加载中...</Text>
          </View>
        ) : (
          /* 注重性能 虚拟列表 */
          <FlatList
            data={todos}
            renderItem={renderTodo}
            keyExtractor={item => item.id}
            style={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text variant="bodyLarge" style={styles.emptyText}>
                  暂无待办事项
                </Text>
                <Text variant="bodyMedium" style={styles.emptySubText}>
                  添加你的第一个待办事项吧！
                </Text>
              </View>
            }
          />
        )}
      </View>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:20,
    marginTop:40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold'
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  statsText: {
    color: '#666',
    fontWeight: '500'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10
  },
  input: {
    flex: 1
  },
  addButton: {
    borderRadius: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  clearButton: {
    borderRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#999',
    textAlign: 'center',
  },
  list: {
    flex: 1
  }
})