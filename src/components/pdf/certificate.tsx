import {
  Page,
  Line,
  Image,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Svg,
  // Page,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

// const PDFViewer = dynamic(
//   () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
//   {
//     ssr: false,
//     loading: () => <p>Loading...</p>,
//   }
// );

Font.register({
  family: 'Noticia Text',
  src: '/fonts/Noticia_Text/NoticiaText-Regular.ttf',
  fontStyle: 'normal',
  fontWeight: 'normal',
});

Font.register({
  family: 'Noto Serif',
  src: '/fonts/Noto_Serif_Display/NotoSerifDisplay-VariableFont.ttf',
  fontStyle: 'normal',
  fontWeight: 'normal',
});

Font.register({
  family: 'Poppins',
  src: '/fonts/Poppins/Poppins-Regular.ttf',
  fontStyle: 'normal',
  fontWeight: 'normal',
});

// Create styles
const styles = StyleSheet.create({
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
  },
  container: {
    position: 'absolute',
    top: '0',
    left: '0',
  },
  section: {
    padding: 65,
    width: '100vw',
    letterSpacing: 3,
    textAlign: 'center',
  },
  title: {
    fontSize: 44,
    color: '#252525',
    fontFamily: 'Noto Serif',
  },
  text: {
    fontSize: 14,
    color: '#252525',
    letterSpacing: 2,
    fontFamily: 'Noticia Text',
  },
  awardedToText: {
    fontSize: 12,
    letterSpacing: 1,
    color: '#252525',
    fontFamily: 'Poppins',
    fontWeight: 300,
    opacity: 0.7,
  },
  certificateNumber: {
    fontSize: 12,
    color: '#252525',
    fontFamily: 'Poppins',
    letterSpacing: 1,
    fontWeight: 300,
    opacity: 0.7,
  },
  volunteerNameText: {
    marginVertical: 10,
    marginBottom: 20,
    fontSize: 36,
    color: '#252525',
    fontFamily: 'Noto Serif',
  },
  description: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#252525',
    fontFamily: 'Poppins',
  },
  subDescription: {
    letterSpacing: 1,
    marginTop: 12,
    fontSize: 11,
    textAlign: 'center',
    width: '60%',
    marginHorizontal: 'auto',
    color: '#252525',
    fontFamily: 'Noticia Text',
    // fontStyle: 'bold',
  },
  images: {
    marginTop: 30,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.7,
  },
  smallText: {
    fontSize: 10,
    color: '#252525',
    letterSpacing: 2,
    fontFamily: 'Poppins',
  },
});

// Create Document Component
export const EventCertificate = ({
  description,
  shortDescription,
  organizationName,
  volunteerName,
  certificateNumber,
  level,
  logoUrl,
  qrCode,
}: {
  description: string;
  shortDescription: string;
  organizationName: string;
  volunteerName: string;
  certificateNumber: string;
  level: number;
  logoUrl: string | null;
  qrCode: string;
}) => {
  return (
    <Document pageLayout="singlePage">
      <Page size={'A4'} style={styles.page}>
        <View>
          <Image src={'/pdf/background.png'} />
          <View style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.title}>CERTIFICATE</Text>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.text}>For volunteer</Text>
                <Text style={styles.text}>Participation</Text>
                <View style={{ position: 'relative' }}>
                  <Image
                    src={'/images/logo/wreath_icon.png'}
                    style={{
                      marginVertical: 15,
                      height: '100px',
                      alignSelf: 'center',
                    }}
                  />
                  <Image
                    src={`/images/volunteer_level/level_${level}.png`}
                    style={{
                      height: '70px',
                      alignSelf: 'center',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-35 -35)',
                    }}
                  />
                </View>
                <Text style={styles.awardedToText}>
                  This certificate is awarded to:
                </Text>
                <Text style={styles.certificateNumber}>
                  The certificate number {certificateNumber}
                </Text>
                <Text style={styles.volunteerNameText}>{volunteerName}</Text>
                <Text style={styles.description}>
                  {description ?? '[description]'}
                </Text>
                <Text style={styles.subDescription}>
                  {shortDescription ?? '[short description]'}
                </Text>
                <View style={styles.images}>
                  <View
                    style={{
                      height: '70px',
                      width: '150px',
                    }}
                  >
                    <Image
                      src={qrCode}
                      style={{
                        aspectRatio: '1/1',
                        width: '100%',
                        objectFit: 'contain',
                        marginBottom: 10,
                      }}
                    />
                    <Text style={styles.smallText}>Scan this qr code</Text>
                  </View>
                  <View
                    style={{
                      height: '70px',
                      width: '200px',
                    }}
                  >
                    <Image
                      src={'/images/logo/EEJII_Logo_Colored.png'}
                      style={{
                        width: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                      }}
                    />
                    <Text style={styles.smallText}>Eejii.org</Text>
                  </View>
                  <View
                    style={{
                      height: '70px',
                      width: '150px',
                    }}
                  >
                    {logoUrl && (
                      <Image
                        src={logoUrl}
                        style={{
                          width: '100%',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          marginBottom: 10,
                        }}
                      />
                    )}
                    <Text style={styles.smallText}>
                      {organizationName ?? '[organization name]'}
                    </Text>
                  </View>
                </View>
                <Image
                  src={'/images/volunteer_level/level_4.png'}
                  style={{
                    marginTop: 20,
                    height: '70px',
                    width: '150px',
                    objectFit: 'contain',
                    marginHorizontal: 'auto',
                  }}
                />
                <Svg height={10} width={600}>
                  <Line
                    x1={153}
                    x2={312}
                    y1={0}
                    y2={0}
                    stroke="rgb(0,0,0)"
                    strokeWidth={2}
                  />
                </Svg>
                <Text style={styles.date}>
                  {format(new Date(), 'd MMM yyyy')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
