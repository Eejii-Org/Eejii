import { useEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5maps from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import type { Country } from '@/lib/db/types';

const MapChart = ({ countries }: { countries?: Country[] }) => {
  useEffect(() => {
    // Apply themes
    const root = am5.Root.new('chartdiv');
    root.setThemes([am5themes_Animated.new(root)]);

    // Create map chart
    const chart = root.container.children.push(
      am5maps.MapChart.new(root, {
        panX: 'rotateX',
        projection: am5maps.geoMercator(),
        wheelable: false,
        wheelY: 'none',
        maxZoomLevel: 1,
      })
    );

    // console.log(data);
    const polygonSeries = chart.series.push(
      am5maps.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        fill: am5.Color.fromString('#b6b6b6'),
        exclude: ['AQ'],
      })
    );
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: '{name} {value}',
      templateField: 'polygonSettings',
      nonScalingStroke: true,
      fillOpacity: 0.8,
      interactive: true,
      tooltipPosition: 'fixed',
    });

    const countriesData = countries?.map(country => ({
      id: country?.code,
      name: country?.name,
      value: country?.volunteers ?? 0,
      polygonSettings: {
        fill: am5.Color.fromString('#3c888d'),
      },
    }));
    polygonSeries.data.setAll(countriesData ?? []);
    polygonSeries.data.setAll([
      {
        id: 'FR',
        name: 'France',
        // value: 100,
        polygonSettings: {
          fill: am5.Color.fromString('#3c888d'),
        },
      },
      {
        id: 'MN',
        name: 'Mongolia',
        // value: 100,
        polygonSettings: {
          fill: am5.Color.fromString('#3c888d'),
        },
      },
      {
        id: 'US',
        name: 'United States',
        // value: 100,
        polygonSettings: {
          fill: am5.Color.fromString('#3c888d'),
        },
      },
      {
        id: 'DZ',
        name: 'Algeria',
        // value: 100,
        polygonSettings: {
          fill: am5.Color.fromString('#3c888d'),
        },
      },
      {
        id: 'SE',
        name: 'Sweden',
        // value: 100,
        polygonSettings: {
          fill: am5.Color.fromString('#3c888d'),
        },
      },
      {
        id: 'AL',
        name: 'Albania',
        // value: 100,
        polygonSettings: {
          fill: am5.Color.fromString('#3c888d'),
        },
      },
      {
        id: 'UG',
        name: 'Uganda',
        // value: 100,
        polygonSettings: {
          fill: am5.Color.fromString('#3c888d'),
        },
      },
      {
        id: 'KR',
        name: 'Korea',
        // value: 100,
        polygonSettings: {
          fill: am5.Color.fromString('#3c888d'),
        },
      },
      {
        id: 'MM',
        name: 'Myanmar',
        // value: 100,
        polygonSettings: {
          fill: am5.Color.fromString('#3c888d'),
        },
      },
      {
        id: 'BD',
        name: 'Bangladesh',
        // value: 100,
        polygonSettings: {
          fill: am5.Color.fromString('#3c888d'),
        },
      },
    ]);

    // Set hover and active states
    polygonSeries.mapPolygons.template.states.create('hover', {
      fill: am5.Color.fromString('#'),
    });

    polygonSeries.mapPolygons.template.states.create('active', {
      fill: am5.Color.fromString('#3C888D'),
    });

    // Handle click on "water" to zoom out
    chart?.chartContainer?.get('background')?.events.on('click', function () {
      chart.goHome();
    });

    // Animate on load
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" className="w-full h-96 md:h-[576px]" />;
};

export default MapChart;
