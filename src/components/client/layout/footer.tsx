import { Row, Col } from "antd";
import Image from "next/image";
import { IMAGES } from "@/constants/client/theme";

export default function FooterSection() {
  return (
    <div className="border-t border-[#E2E8F0] py-4">
      <div className="max-w-7xl mx-auto px-4">
        <Row justify="space-between" align="middle">
          <Col>
            <p className="text-[#335479] text-sm">
              © 2025 The Maxima Experience. All rights reserved
            </p>
          </Col>

          <Col>
            <div className="flex items-center gap-2">
              <span className="text-[#335479] text-sm">Language:</span>
              <button className="w-6 h-6 rounded-full flex items-center justify-center">
                <Image
                  src={IMAGES.LangViet}
                  alt="Vietnam Flag"
                  width={32}
                  height={32}
                  priority
                />
              </button>
              <button className="w-6 h-6 rounded-full flex items-center justify-center">
                <Image
                  src={IMAGES.LangAnh}
                  alt="English Flag"
                  width={32}
                  height={32}
                  priority
                />
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
