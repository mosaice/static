import "./App.css";
import { useState, useEffect } from "react";
import { Button, Typography, Card, Tag, Divider } from "antd";
import axios from "axios";
import get from "lodash.get";
const { Title } = Typography;

function App() {
  const [current, setCurrent] = useState(-1);
  const [titles, setTitles] = useState([]);
  const [exam, setExam] = useState([]);

  useEffect(() => {
    axios
      .get("data.json")
      .then((res) => {
        setTitles(res.data);
        return Promise.all(
          res.data.map((name) =>
            axios.get(`${name}.json`).then((res) => res.data)
          )
        );
      })
      .then((res) => {
        setExam(res.map((r) => get(r, "data.paperEntity")));
      });
  }, [setExam]);

  const paper = exam[current];

  return (
    <div>
      <div className="center">
        {titles.map((t, index) => {
          return (
            <Button
              type={current === index ? "primary" : undefined}
              key={index}
              onClick={() => setCurrent(index)}
            >
              {t}
            </Button>
          );
        })}
      </div>
      {paper && (
        <>
          <Divider>{titles[current]}</Divider>
          <Title level={1} className="center">
            {paper.name}
          </Title>
          {paper.paperAreaList.map((paper) => (
            <div key={paper.paperAreaName}>
              <br />
              <br />
              <Title level={2} type="success" className="center">
                {paper.paperAreaName} X {paper.questionList.length}
              </Title>
              {paper.questionList.map((q, qi) => {
                const {
                  questionSequence,
                  questionType,
                  questionContentType,
                  questionDifficulty,
                  content,
                  questionAnswers,
                } = q;
                return (
                  <Card
                    key={qi}
                    bordered={false}
                    title={`编号:${questionSequence} ${questionType}-${questionContentType}-${questionDifficulty}`}
                  >
                    <div className="left">
                      <Title level={4}>{content}</Title>
                      {questionAnswers.map((qa) => (
                        <Tag
                          key={qa.id}
                          color={qa.isRight ? "#108ee9" : undefined}
                        >
                          {qa.content}
                        </Tag>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
