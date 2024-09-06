import React, { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import { useSelector } from "react-redux";

const EChartComponent = () => {
  const [clickNumByDay, setClickNumByDay] = useState([]);
  const chartRef = useRef(null);

    const tempUser = useSelector((state) => state.user);
    const currentUser = tempUser.currentUser.rest
      ? tempUser.currentUser.rest
      : tempUser.currentUser;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ limit: 5 }),
        });
        const data = await res.json();
        if (res.ok) {
          setClickNumByDay(data.clickNumByDay);
        }
      } catch (error) {
        console.log("fetch posts error");
        console.log(error.message);
      }
      };
      fetchPosts(); 
  }, [currentUser]);
  console.log(clickNumByDay);
  const date = clickNumByDay.map((item) => item.date);
  const totalClicks = clickNumByDay.map((item) => item.totalClicks);

  useEffect(() => {


    const chartInstance = echarts.init(chartRef.current);

    const option = {
      title: {
        text: "网站点击量",
        left: "center",
        top: "top",
        textStyle: {
          fontSize: 18,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: date, 
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "点击量",
          type: "line",
          data: totalClicks, 
          smooth: true, 
          lineStyle: {
            color: "#FF6600", 
          },
          itemStyle: {
            color: "#FF6600",
          },
        },
      ],
    };

    chartInstance.setOption(option);

    // 处理窗口大小变化
    const handleResize = () => chartInstance.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.dispose(); // 清理 ECharts 实例
    };
  }, [clickNumByDay]); 

  return (
    <div
      ref={chartRef}
      className="w-full h-[400px] flex items-center justify-center"
    />
  );
};

export default EChartComponent;
