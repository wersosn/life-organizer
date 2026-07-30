import { Todo } from "@/types/todo";
import { Pressable, View, Text, StyleSheet, useColorScheme, Image } from "react-native";

type Props = {
    todo: Todo;
    onComplete: (id: string) => void | Promise<void>;
    onDelete: (id: string) => void | Promise<void>;
    onEdit: (todo: Todo) => void;
};

export default function TodoCard({ todo, onComplete, onDelete, onEdit, }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: isDark
                        ? "#1E1E1E"
                        : "#FFFFFF",
                },
            ]}
        >

            <Pressable
                onPress={() => onComplete(todo.id)}
                style={[
                    styles.checkbox,
                    todo.isCompleted && styles.checked,
                ]}
            >
                {todo.isCompleted && (
                    <Text style={styles.checkmark}>
                        ✓
                    </Text>
                )}
            </Pressable>


            <View style={styles.content}>

                <Text
                    style={[
                        styles.title,
                        {
                            color: isDark
                                ? "#FFFFFF"
                                : "#000000",
                        },
                        todo.isCompleted &&
                        styles.completedText,
                    ]}
                >
                    {todo.title}
                </Text>


                {
                    todo.description &&
                    <Text
                        style={[
                            styles.description,
                            {
                                color: isDark
                                    ? "#AAAAAA"
                                    : "#777777",
                            },
                        ]}
                    >
                        {todo.description}
                    </Text>
                }

            </View>


            <View style={styles.actions}>
                <Pressable
                    onPress={() => onEdit(todo)}
                    hitSlop={10}
                    style={styles.iconButton}
                >
                    <Image
                        source={isDark ? require("@/assets/images/edit-light.png") : require("@/assets/images/edit-dark.png")}
                        style={styles.icon}
                    />
                </Pressable>

                <Pressable
                    onPress={() => onDelete(todo.id)}
                    hitSlop={10}
                    style={styles.iconButton}
                >
                    <Image
                        source={isDark ? require("@/assets/images/trash-light.png") : require("@/assets/images/trash-dark.png")}
                        style={styles.icon}
                    />
                </Pressable>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({

    card: {
        flexDirection: "row",
        alignItems: "center",

        borderRadius: 16,
        padding: 16,

        marginBottom: 12,

        shadowColor: "#f5f5f5",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 3,
    },


    checkbox: {
        width: 26,
        height: 26,

        borderRadius: 8,

        borderWidth: 2,
        borderColor: "#4F7CFF",

        justifyContent: "center",
        alignItems: "center",

        marginRight: 14,
    },


    checked: {
        backgroundColor: "#4F7CFF",
    },


    checkmark: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },


    content: {
        flex: 1,
    },


    title: {
        fontSize: 16,
        fontWeight: "600",
    },


    completedText: {
        textDecorationLine: "line-through",
        opacity: 0.5,
    },


    description: {
        marginTop: 5,
        fontSize: 14,
    },


    actions: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 12,
    },


    iconButton: {
        marginLeft: 14,
    },

    icon: {
        width: 22,
        height: 22,
        resizeMode: "contain",
    },
})