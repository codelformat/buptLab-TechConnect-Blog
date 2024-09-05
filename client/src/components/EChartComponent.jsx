import React, { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import { useSelector } from "react-redux";

const EChartComponent = () => {
  const [clickNumByDay, setClickNumByDay] = useState([]);
  const chartRef = useRef(null);

    // 获取数据
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
      fetchPosts(); // 在组件挂载时获取数据
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
        data: date, // 可能需要检查 `date` 是否存在
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "点击量",
          type: "line",
          data: totalClicks, // 可能需要检查 `totalClicks` 是否存在
          smooth: true, // 平滑线
          lineStyle: {
            color: "#FF6600", // 线条颜色
          },
          itemStyle: {
            color: "#FF6600", // 点的颜色
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
  }, [clickNumByDay]); // 添加依赖项，以便数据变化时更新图表

  return (
    <div
      ref={chartRef}
      className="w-full h-[400px] flex items-center justify-center"
    />
  );
};

export default EChartComponent;
