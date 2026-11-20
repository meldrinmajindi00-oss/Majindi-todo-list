import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import { todoApi } from "../services/api";

export default function HomeScreen() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadTodos = useCallback(async () => {
    try {
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (error) {
      Alert.alert(
        "Connection error",
        `${error.message}\n\nCheck that the backend is running and the API URL uses your computer's local IP.`
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = async (title) => {
    try {
      setSaving(true);
      const newTodo = await todoApi.create(title);
      setTodos((current) => [newTodo, ...current]);
      return true;
    } catch (error) {
      Alert.alert("Could not add to-do", error.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const updated = await todoApi.update(todo._id, {
        completed: !todo.completed,
      });

      setTodos((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      );
    } catch (error) {
      Alert.alert("Could not update to-do", error.message);
    }
  };

  const deleteTodo = (todo) => {
    Alert.alert(
      "Delete to-do?",
      `Remove "${todo.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await todoApi.remove(todo._id);
              setTodos((current) =>
                current.filter((item) => item._id !== todo._id)
              );
            } catch (error) {
              Alert.alert("Could not delete to-do", error.message);
            }
          },
        },
      ]
    );
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>MERN REACT NATIVE</Text>
        <Text style={styles.heading}>My To-Do List</Text>
        <Text style={styles.subheading}>
          {todos.length} total • {completedCount} completed
        </Text>

        <TodoForm onAdd={addTodo} disabled={saving} />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading to-dos...</Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            )}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadTodos();
            }}
            contentContainerStyle={
              todos.length === 0 ? styles.emptyList : styles.list
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyTitle}>No tasks yet</Text>
                <Text style={styles.emptyText}>
                  Add your first to-do above.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: "800",
    color: "#6b7280",
  },
  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#111827",
    marginTop: 3,
  },
  subheading: {
    fontSize: 15,
    color: "#6b7280",
    marginTop: 5,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 30,
  },
  emptyList: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#6b7280",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  emptyText: {
    marginTop: 5,
    color: "#6b7280",
  },
});
