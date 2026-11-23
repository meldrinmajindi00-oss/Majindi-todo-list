import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

export default function TodoForm({ onAdd, disabled }) {
  const [title, setTitle] = useState("");

  const submit = async () => {
    const cleanTitle = title.trim();
    if (!cleanTitle || disabled) return;

    const added = await onAdd(cleanTitle);
    if (added) setTitle("");
  };

  return (
    <View style={styles.row}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="What do you need to do?"
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={submit}
        editable={!disabled}
      />

      <TouchableOpacity
        style={[styles.button, disabled && styles.disabled]}
        onPress={submit}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d8dee9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#111827",
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
