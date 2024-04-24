import type { User } from '@/lib/db/types';
import type { EventParticipator } from '@/lib/types';
import {
  Page,
  Image,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO';

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
    position: 'relative',
    padding: '20',
  },
  bgImageContainer: {
    position: 'absolute',
    top: 0,
    left: 5,
    padding: 10,
    width: '100%',
    height: '100%',
  },
  bgImage: {
    objectPosition: 'center',
    objectFit: 'contain',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  container: {
    width: '100%',
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: '2px solid #4A999E',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: 10,
    position: 'relative',
  },
  title: {
    fontSize: 38,
    color: '#252525',
    fontFamily: 'Poppins',
  },
  subTitle: {
    width: '165',
    fontSize: 14,
    color: '#252525',
    fontFamily: 'Poppins',
    fontWeight: 500,
    textTransform: 'uppercase',
    borderTop: '1px solid #4A999E',
    paddingTop: 4,
  },
  flexStart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 5,
  },
  boldText: {
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: 500,
    color: '#252525',
    letterSpacing: 1,
  },
  smallBoldText: {
    fontFamily: 'Poppins',
    fontSize: 8,
    fontWeight: 600,
    color: '#252525',
  },
  smallText: {
    fontSize: 8,
    color: '#252525',
    fontFamily: 'Poppins',
  },
  text: {
    fontSize: 10,
    color: '#252525',
    // letterSpacing: 1,
    fontFamily: 'Poppins',
  },
  extraSmallText: {
    fontSize: 7,
    color: '#252525',
    fontFamily: 'Poppins',
    fontWeight: 300,
    opacity: 0.8,
  },
  extraSmallDimText: {
    fontSize: 7,
    color: '#252525',
    fontFamily: 'Poppins',
    fontWeight: 300,
    opacity: 0.7,
  },
  volunteerNameText: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 24,
    letterSpacing: 1,
    color: '#252525',
    fontFamily: 'Noto Serif',
  },
  images: {
    marginTop: 30,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontSize: 10,
    color: '#252525',
    letterSpacing: 2,
    fontFamily: 'Poppins',
    fontWeight: 600,
  },
  table: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'column',
    marginVertical: 10,
    // flexWrap: 'wrap',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    paddingVertical: 5,
  },
  tableRow: {
    marginTop: 3,
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 3,
    alignItems: 'flex-start',
    gap: 5,
  },
  td1: {
    width: '30%',
    textAlign: 'left',
  },
  td2: {
    width: '25%',
    textAlign: 'left',
  },
  td3: {
    width: '15%',
    textAlign: 'left',
  },
  td4: {
    width: '5%',
    textAlign: 'left',
  },
  td5: {
    width: '25%',
    textAlign: 'left',
  },
  bottomContainer: {
    borderTop: '1px solid #4A999E',
    marginTop: 10,
    paddingVertical: 5,
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    gap: 5,
    width: '100%',
  },
});

const Summary = ({ user }: { user: User }) => {
  return (
    <View>
      <Text style={styles.title}>Activity Report</Text>
      <Text style={styles.subTitle}>Proudly presented to</Text>
      <Text style={styles.volunteerNameText}>
        {user?.firstName} {user?.lastName}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 10,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            height: 70,
            width: 100,
            paddingRight: 10,
            borderRight: '1px solid #4A999E',
          }}
        >
          <Image
            src={{
              uri: `/images/volunteer_level/level_${user?.level}.png`,
              method: 'GET',
              headers: { 'Cache-Control': 'no-cache' },
              body: '',
            }}
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <View
            style={{
              ...styles.flexStart,
              borderBottom: '1px solid #4A999E',
              paddingBottom: 5,
            }}
          >
            <Text style={styles.boldText}>Level:</Text>
            <Text style={styles.text}>{user?.level}</Text>
          </View>
          <View
            style={{
              ...styles.flexStart,
              borderBottom: '1px solid #4A999E',
              paddingBottom: 5,
            }}
          >
            <Text style={styles.boldText}>ID:</Text>
            <Text style={styles.text}>
              {user?.username as unknown as string}
            </Text>
          </View>
          <View
            style={{
              ...styles.flexStart,
            }}
          >
            <Text style={styles.boldText}>XP:</Text>
            <Text style={styles.text}>{user?.xp}</Text>
          </View>
        </View>
        <View
          style={{
            maxWidth: 360,
          }}
        >
          <Text style={{ ...styles.smallText }}>
            EEJII acknowledges the invaluable efforts of {user?.firstName}{' '}
            {user?.lastName} in furthering our mission and goals. Through your
            commitment, enthusiasm, and unwavering support, you have made a
            significant impact on our initiatives and the communities we serve.
          </Text>
        </View>
      </View>
    </View>
  );
};
const BottomContainer = ({ qrCode }: { qrCode: string }) => {
  return (
    <View fixed style={styles.bottomContainer}>
      <View
        style={{
          padding: 5,
          height: '80',
          width: '100% /3',
          borderRight: '1px solid #4A999E',
        }}
      >
        <Image
          src={'/pdf/stamp.png'}
          style={{
            width: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      </View>
      <View
        style={{
          padding: 5,
          height: '80',
          width: '100% /3',
          borderRight: '1px solid #4A999E',
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
      </View>
      <View
        style={{
          padding: 5,
          height: '80',
          width: '100%/3',
        }}
      >
        <Image
          src={qrCode}
          style={{
            aspectRatio: '1/1',
            width: '100%',
            objectFit: 'contain',
            marginBottom: 3,
          }}
        />
        <Text style={{ ...styles.smallText, textAlign: 'center' }}>
          E-Certificate
        </Text>
      </View>
    </View>
  );
};

// Create Document Component
export const ReportLetter = ({
  qrCode,
  participations,
}: {
  qrCode: string;
  participations: EventParticipator[] | null;
}) => {
  return (
    <Document>
      <Page size={'A4'} style={styles.page}>
        <View>
          <View style={styles.bgImageContainer}>
            <Image
              src={{
                uri: '/pdf/report-letter-bg.png',
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache' },
                body: '',
              }}
              style={styles.bgImage}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.border} fixed />
            <View style={styles.section}>
              <View>
                <Summary user={participations?.[0]?.User as User} />

                {/* TABLE */}
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <View style={styles.td1}>
                      <Text style={styles.boldText}>ORGANIZATION</Text>
                    </View>
                    <View style={styles.td2}>
                      <Text style={styles.boldText}>ACTIVITY NAME</Text>
                    </View>
                    <View style={styles.td3}>
                      <Text style={styles.boldText}>DURATION</Text>
                    </View>
                    <View style={styles.td4}>
                      <Text style={styles.boldText}>XP</Text>
                    </View>
                    <View style={styles.td5}>
                      <Text style={styles.boldText}>DESCRIPTION</Text>
                    </View>
                  </View>
                  {participations &&
                    participations?.map((p, i) => (
                      <View style={styles.tableRow} key={i}>
                        <View style={styles.td1}>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 5,
                            }}
                          >
                            <View
                              style={{
                                height: 40,
                                width: 40,
                              }}
                            >
                              <Image
                                src={{
                                  uri:
                                    process.env.NEXT_PUBLIC_AWS_PATH +
                                    '/' +
                                    p.Event?.Owner?.Images?.[0]?.path,
                                  method: 'GET',
                                  headers: { 'Cache-Control': 'no-cache' },
                                  body: '',
                                }}
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  objectFit: 'contain',
                                  objectPosition: 'center',
                                }}
                              />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.smallBoldText}>
                                {p.Event?.Owner.organizationName}
                              </Text>
                              <Text
                                style={{
                                  ...styles.extraSmallDimText,
                                }}
                              >
                                {p.Event?.Owner?.Addresses?.[0]?.country}{' '}
                                {p.Event?.Owner?.Addresses?.[0]?.city}{' '}
                                {p.Event?.Owner?.Addresses?.[0]?.provinceName}{' '}
                                {p.Event?.Owner?.Addresses?.[0]?.district}{' '}
                                {p.Event?.Owner?.Addresses?.[0]?.street}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.td2}>
                          <View
                            style={{
                              flex: 1,
                            }}
                          >
                            <Text style={styles.smallText}>
                              {p.Event?.title}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.td3}>
                          <View
                            style={{
                              flex: 1,
                            }}
                          >
                            <Text style={styles.smallText}>
                              {/* {p.Event?.startTime && p.Event?.endTime && ( */}
                              {format(
                                parseISO(
                                  participations?.[0]?.Event
                                    ?.startTime as unknown as string
                                ),
                                'MMM d, yyyy'
                              )}
                              {' - '}
                              {format(
                                parseISO(
                                  participations?.[0]?.Event
                                    ?.startTime as unknown as string
                                ),
                                'MMM d, yyyy'
                              )}
                              {/* )} */}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.td4}>
                          <Text style={styles.smallText}>
                            {p.volunteeringPoint}xp
                          </Text>
                        </View>
                        <View style={styles.td5}>
                          <View
                            style={{
                              flex: 1,
                            }}
                          >
                            <Text
                              style={{ ...styles.extraSmallText, maxLines: 4 }}
                            >
                              {p.Event?.description}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                </View>
              </View>
              {/* BOTTOM */}
              <BottomContainer qrCode={qrCode} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
