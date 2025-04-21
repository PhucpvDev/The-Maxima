import { Collapse, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const faqData = [
  {
    question: "How do users withdraw their profits?",
    answer: "Users can withdraw profits via their account dashboard using supported payment methods."
  },
  {
    question: "What makes Maxima different from traditional brokers?",
    answer: "Maxima uses modern technology and a client-first approach, offering transparency and flexibility."
  },
  {
    question: "Is it safe to trade in Maxima platform?",
    answer: "Yes, Maxima applies encryption, multi-factor authentication, and secure financial protocols."
  },
  {
    question: "How does Maxima stand out compared to conventional brokerage firms?",
    answer: "Maxima offers lower fees, faster execution, and a more intuitive user experience."
  },
  {
    question: "In what ways is Maxima's approach unique from traditional brokers?",
    answer: "Maxima focuses on technology-driven solutions and user-friendly platforms over outdated manual processes."
  },
  {
    question: "What are the key differences between Maxima and typical brokerage services?",
    answer: "Lower fees, improved security, and real-time analytics are Maxima's standout features."
  }
];

export default function FAQSection() {
  return (
    <div className="bg-white py-12 px-4 md:px-16 text-center">
      <p className="text-2xl md:text-3xl font-bold text-[#002146] mb-8 uppercase">Frequently Asked Questions</p>

      <div className="max-w-6xl mx-auto text-left">
        <Collapse
          accordion
          expandIcon={({ isActive }) => (
            <DownOutlined rotate={isActive ? 180 : 0} />
          )}
          className="site-collapse-custom-collapse rounded-lg overflow-hidden"
        >
          {faqData.map((item, index) => (
            <Panel header={item.question} key={index} className="text-base text-[#002146]">
              <p>{item.answer}</p>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
}
