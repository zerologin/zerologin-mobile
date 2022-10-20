import { Pressable, View, Text, StyleSheet } from 'react-native'

export enum ButtonType {
    primary = 'primary',
    secondary = 'secondary',
}

interface ButtonProps {
    text: string
    type: ButtonType
    onPress: () => void
}

export default function Button(props: ButtonProps) {
    function handlePress() {
        props.onPress()
    }

    return (
        <Pressable onPress={handlePress}>
            <View
                style={props.type === ButtonType.primary ? style.viewPrimary : style.viewSecondary}>
                <Text style={props.type === ButtonType.primary ? style.textPrimary : style.textSecondary}>{props.text}</Text>
            </View>
        </Pressable>
    )
}

const commonStyle = StyleSheet.create({
    viewMain: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderColor: '#8b5cf6',
        borderWidth: 2,
    },
})
const style = StyleSheet.create({
    viewPrimary: {
        borderRadius: 12,
        backgroundColor: '#8b5cf6',
        ...commonStyle.viewMain,
    },
    viewSecondary: {
        borderRadius: 12,
        ...commonStyle.viewMain,
    },
    textPrimary: {
        color: '#fff',
    },
    textSecondary: {
        color: '#8b5cf6',
    },
})
