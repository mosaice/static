import "./App.css";
import { useState, useEffect, useMemo } from "react";
import { Button, Typography, Card, Tag } from "antd";
import axios from "axios";
import get from "lodash.get";
const { Title } = Typography;

const request = async () => {
  const { data } = await axios.get("data.json");
  return Promise.all(
    data.map((name) => axios.get(`${name}.json`).then((res) => res.data))
  );
};

function App() {
  const [current, setCurrent] = useState();
  const [exam, setExam] = useState([]);

  useEffect(() => {
    request().then((res) => {
      setExam(res.map((r) => get(r, "data.paperEntity")));
    });
  }, [setExam]);

  const paper = useMemo(
    () => exam.find((e) => e.name === current),
    [current, exam]
  );

  return (
    <div>
      <div className="center">
        {(exam ?? []).map((item, index) => {
          return (
            <Button
              type={current === item.name ? "primary" : undefined}
              key={item.name}
              onClick={() => setCurrent(item.name)}
            >
              {item.name}
            </Button>
          );
        })}
      </div>
      {paper && (
        <>
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
