import { SvgUri } from 'react-native-svg'

export default function Avatar(props: { identifier: string; size?: number }) {
    const size = props.size || 32
    if (!props.identifier || props.identifier === '') return null
    return (
        <SvgUri
            width={size}
            height={size}
            uri={`https://source.boringavatars.com/beam/32/${props.identifier}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`}
        />
    )
}
