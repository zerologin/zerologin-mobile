import { StyleSheet, View } from 'react-native'

interface WrapperProps {
    children: React.ReactNode
}

export default function ScanModal(props: WrapperProps) {
    return <View style={styles.menu}>{props.children}</View>
}

export const styles = StyleSheet.create({
    menu: {
        flex: 1,
        backgroundColor: '#000',
        color: '#fff',
        borderRadius: 8,
        opacity: 0.8,
        padding: 20,
    },
    text: {
        color: '#fff',
        textAlign: 'center',
    },
})
