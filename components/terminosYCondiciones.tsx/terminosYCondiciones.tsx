import { Image, StyleSheet, Text, View } from "react-native";

export function TerminosYCondiciones() {
    const ULTIMA_ACTUALIZACION = "dd/MM/YYYY";
    return (
        <>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/escudoAnisacate.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>TÉRMINOS Y CONDICIONES DE USO DE LA APLICACIÓN “LA ANISACATENSE”</Text>
                <Text style={styles.paragraph}>Lorem ipsum dolor sit amet consectetur adipiscing elit vivamus neque, nisi porta praesent parturient nascetur morbi felis mollis feugiat, faucibus aliquam egestas integer placerat aliquet mattis donec. Torquent ligula sapien per commodo cubilia augue eget nullam porta cursus nec tellus, parturient felis aliquet inceptos in dapibus curae volutpat metus erat. Ligula aenean odio neque tellus nam ut cubilia euismod, fusce cursus morbi enim rhoncus facilisis inceptos pretium, est mollis mauris maecenas senectus lacus aliquam. Faucibus habitant fames in magna purus sociis, nullam ad elementum libero.</Text>
                <Text style={styles.paragraph}>Lorem ipsum dolor sit amet consectetur adipiscing elit vivamus neque, nisi porta praesent parturient nascetur morbi felis mollis feugiat, faucibus aliquam egestas integer placerat aliquet mattis donec. Torquent ligula sapien per commodo cubilia augue eget nullam porta cursus nec tellus, parturient felis aliquet inceptos in dapibus curae volutpat metus erat. Ligula aenean odio neque tellus nam ut cubilia euismod, fusce cursus morbi enim rhoncus facilisis inceptos pretium, est mollis mauris maecenas senectus lacus aliquam. Faucibus habitant fames in magna purus sociis, nullam ad elementum libero.</Text>
                <Text style={styles.paragraph}>Lorem ipsum dolor sit amet consectetur adipiscing elit vivamus neque, nisi porta praesent parturient nascetur morbi felis mollis feugiat, faucibus aliquam egestas integer placerat aliquet mattis donec. Torquent ligula sapien per commodo cubilia augue eget nullam porta cursus nec tellus, parturient felis aliquet inceptos in dapibus curae volutpat metus erat. Ligula aenean odio neque tellus nam ut cubilia euismod, fusce cursus morbi enim rhoncus facilisis inceptos pretium, est mollis mauris maecenas senectus lacus aliquam. Faucibus habitant fames in magna purus sociis, nullam ad elementum libero.</Text>
                <Text style={styles.paragraph}>Lorem ipsum dolor sit amet consectetur adipiscing elit vivamus neque, nisi porta praesent parturient nascetur morbi felis mollis feugiat, faucibus aliquam egestas integer placerat aliquet mattis donec. Torquent ligula sapien per commodo cubilia augue eget nullam porta cursus nec tellus, parturient felis aliquet inceptos in dapibus curae volutpat metus erat. Ligula aenean odio neque tellus nam ut cubilia euismod, fusce cursus morbi enim rhoncus facilisis inceptos pretium, est mollis mauris maecenas senectus lacus aliquam. Faucibus habitant fames in magna purus sociis, nullam ad elementum libero.</Text>
                <Text style={styles.paragraph}>Lorem ipsum dolor sit amet consectetur adipiscing elit vivamus neque, nisi porta praesent parturient nascetur morbi felis mollis feugiat, faucibus aliquam egestas integer placerat aliquet mattis donec. Torquent ligula sapien per commodo cubilia augue eget nullam porta cursus nec tellus, parturient felis aliquet inceptos in dapibus curae volutpat metus erat. Ligula aenean odio neque tellus nam ut cubilia euismod, fusce cursus morbi enim rhoncus facilisis inceptos pretium, est mollis mauris maecenas senectus lacus aliquam. Faucibus habitant fames in magna purus sociis, nullam ad elementum libero.</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    header: { alignItems: 'center', paddingVertical: 20 },
    logo: { width: 190, height: 100 },
    content: { paddingHorizontal: 20, paddingBottom: 30 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    paragraph: { fontSize: 14, marginTop: 10, lineHeight: 22 },
});