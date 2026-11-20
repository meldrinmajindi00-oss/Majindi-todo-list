import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.todoArea}
        onPress={() => onToggle(todo)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, todo.completed && styles.checked]}>
          {todo.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>

        <Text
          style={[
            styles.title,
            todo.completed && styles.completedTitle,
          ]}
        >
          {todo.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onDelete(todo)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  todoArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#9ca3af",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  checkmark: {
    color: "#ffffff",
    fontWeight: "800",
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  deleteButton: {
    paddingVertical: 7,
    paddingLeft: 12,
  },
  deleteText: {
    color: "#dc2626",
    fontWeight: "700",
  },
});
