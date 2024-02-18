/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import axios from 'axios';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const [prayerTimes, setPrayerTimes] = useState({});

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const res = await axios.get(
          'https://api.aladhan.com/v1/timingsByCity',
          {
            params: {
              city: 'Cairo',
              country: 'Egypt',
              method: 5,
              school: 0,
            },
          },
        );
        setPrayerTimes(res.data.data.timings);
        console.log(res.data.data.timings, 'response');
      } catch (error) {
        console.error('Error fetching:', error);
      }
    };

    fetchTime();
  }, []);

  const keys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const showPrayerTimes = () => {
    if (!prayerTimes) {
      return <Text>Loading...</Text>;
    }

    const timingComponents = Object.entries(prayerTimes)
      .filter(([key]) => keys.includes(key))
      .map(([key, value], index) => (
        <View key={index} style={styles.timingContainer}>
          <Text style={styles.timingKey}>{key}</Text>
          <Text style={styles.timingValue}>{value}</Text>
        </View>
      ));

    const rows = [];
    for (let i = 0; i < timingComponents.length; i += 2) {
      rows.push(
        <View key={i} style={styles.row}>
          {timingComponents[i]}
          {timingComponents[i + 1] ? (
            timingComponents[i + 1]
          ) : (
            <View style={styles.timingContainer}></View>
          )}
        </View>,
      );
    }

    return <View style={styles.timingsWrapper}>{rows}</View>;
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>
        Egyption General Authority of survey{' '}
      </Text>
      {showPrayerTimes()}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionDescription: {
    // marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    // textAlign: 'center',
    marginRight: 20,
  },
  timingsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  timingContainer: {
    width: '70%',
    alignItems: 'center',
    marginBottom: 10,
  },
  timingKey: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timingValue: {
    textAlign: 'center',
  },
});

export default App;
