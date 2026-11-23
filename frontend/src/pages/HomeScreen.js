
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";

import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import { todoApi } from "../services/api";

export default function HomeScreen() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Edit modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editSaving, setEditSaving] = useState(false);

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

  // Add task
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

  // Complete task
  const toggleTodo = async (todo) => {
    try {
      const updated = await todoApi.update(todo._id, {
        completed: !todo.completed,
      });

      setTodos((current) =>
        current.map((item) =>
          item._id === updated._id ? updated : item
        )
      );
    } catch (error) {
      Alert.alert("Could not update to-do", error.message);
    }
  };

  // Open edit modal
  const editTodo = (todo) => {
    setSelectedTodo(todo);
    setEditedTitle(todo.title);
    setEditModalVisible(true);
  };

  // Save edited task
  const saveEditedTodo = async () => {
    const title = editedTitle.trim();

    if (!title) {
      Alert.alert("Invalid task", "Task name cannot be empty.");
      return;
    }

    if (!selectedTodo) return;

    try {
      setEditSaving(true);

      const updated = await todoApi.update(selectedTodo._id, {
        title: title,
      });

      setTodos((current) =>
        current.map((item) =>
          item._id === updated._id ? updated : item
        )
      );

      setEditModalVisible(false);
      setSelectedTodo(null);
      setEditedTitle("");

      Alert.alert("Success", "Your task has been updated!");
    } catch (error) {
      Alert.alert("Could not edit to-do", error.message);
    } finally {
      setEditSaving(false);
    }
  };

  // Delete task
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

  const closeEditModal = () => {
    if (editSaving) return;

    setEditModalVisible(false);
    setSelectedTodo(null);
    setEditedTitle("");
  };

  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

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
                onEdit={editTodo}
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

        {/* Android Edit Modal */}
        <Modal
          visible={editModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeEditModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Edit To-Do</Text>

              <Text style={styles.modalSubtitle}>
                Update your task name below.
              </Text>

              <TextInput
                style={styles.editInput}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder="Enter task name"
                placeholderTextColor="#9ca3af"
                autoFocus
                maxLength={100}
                editable={!editSaving}
                returnKeyType="done"
                onSubmitEditing={saveEditedTodo}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeEditModal}
                  disabled={editSaving}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    editSaving && styles.disabledButton,
                  ]}
                  onPress={saveEditedTodo}
                  disabled={editSaving}
                >
                  <Text style={styles.saveText}>
                    {editSaving ? "Saving..." : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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

  // Edit modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    padding: 12,
  },
  cancelText: {
    color: "#6b7280",
    fontWeight: "700",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    borderRadius: 9,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  saveText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
