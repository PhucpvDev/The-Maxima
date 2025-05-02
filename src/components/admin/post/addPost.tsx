'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Typography, Upload, Button, Space, message, Card, Row, Col, Switch } from 'antd';
import { UploadOutlined, ArrowLeftOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function AddPost() {
  const t = useTranslations('addPost');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null); // New state for file name
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Log the id to verify it's being read correctly
  console.log('ID from URL:', id);

  // Fetch post data for editing when id is present
  useEffect(() => {
    if (id) {
      console.log('Fetching post data for ID:', id);
      const fetchPost = async () => {
        try {
          const token = Cookies.get('token');
          console.log('Token:', token);
          if (!token) {
            message.error(t('tokenMissing') || 'Authentication token is missing');
            return;
          }

          const response = await axios.get(`http://localhost:3001/api/posts/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('API Response:', response.data);
          const post = response.data;
          form.setFieldsValue({
            title: post.title || '',
            description: post.description || '',
            content: post.content || '',
            published: post.published || false,
          });
          // Update to use the correct path for the image URL and fileName
          setPreviewImage(post.media?.default?.url || null);
          setFileName(post.media?.default?.fileName || null);
        } catch (error) {
          message.error(t('fetchError') || 'Failed to fetch post data');
          console.error('Error fetching post:', error.response?.data || error.message);
        }
      };
      fetchPost();
    } else {
      console.log('No ID found, likely adding a new post');
    }
  }, [id, form, t]);

  // Handle file upload changes
  const handleFileChange = ({ fileList }: { fileList: any[] }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        setFileName(file.name); // Update fileName with the uploaded file's name
      }
    } else {
      setPreviewImage(null);
      setFileName(null);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        message.error(t('tokenMissing') || 'Authentication token is missing');
        setLoading(false);
        return;
      }

      // Validate file upload (required only when adding, optional when editing)
      if (fileList.length === 0 && !id) {
        message.error(t('fileRequired') || 'Please upload a file');
        setLoading(false);
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('content', values.content);
      formData.append('published', values.published.toString());

      // Append files only if provided (for add or update with new file)
      if (fileList.length > 0) {
        fileList.forEach((file) => {
          formData.append('files', file.originFileObj);
        });
      }

      // Debug: Log form data
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      // Make API request (POST for add, PUT for edit)
      const url = id ? `http://localhost:3001/api/posts/${id}` : 'http://localhost:3001/api/posts';
      const method = id ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle success
      message.success(id ? t('updateSuccess') || 'Post updated successfully' : t('postCreated') || 'Post created successfully');
      form.resetFields();
      setFileList([]);
      setPreviewImage(null);
      setFileName(null);
      router.push('/admin/post');
    } catch (error) {
      console.error('Error creating/updating post:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || (id ? t('updateError') : t('postCreateFailed')) || 'Failed to process post';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 min-h-screen">
      <div className="page-header flex justify-between items-center mb-4">
        <Title level={4} className="m-0 text-gray-800">
          {id ? t('editPost') : t('addPost')}
        </Title>
        <Button
          className="back-button hover:bg-gray-100"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/admin/post')}
        >
          {t('backButton')}
        </Button>
      </div>

      <Card className="form-card shadow-sm rounded-lg p-3">
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
        >
          <div className="form-section mb-3">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={<Text className="text-gray-600">{t('titleLabel')}</Text>}
                  name="title"
                  rules={[
                    { required: true, message: t('titleRequired') },
                    { min: 5, message: t('titleMinLength') },
                  ]}
                >
                  <Input
                    placeholder={t('titlePlaceholder')}
                    size="middle"
                    className="rounded"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={3}>
                <Form.Item
                  label={<Text className="text-gray-600">{t('publishedLabel')}</Text>}
                  name="published"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch
                    checkedChildren={t('statusPublished')}
                    unCheckedChildren={t('statusDraft')}
                    className="mt-1"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text className="text-gray-600">{t('thumbnailLabel')}</Text>}
                  name="thumbnail"
                  rules={[
                    {
                      validator: () => {
                        if (fileList.length === 0 && !id) {
                          return Promise.reject(t('fileRequired') || 'Please upload a file');
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <div className="flex items-start gap-4">
                    <Upload
                      beforeUpload={() => false}
                      onChange={handleFileChange}
                      accept="image/*"
                      fileList={fileList}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        className="hover:bg-blue-50"
                        size="middle"
                      >
                        {t('uploadButton')}
                      </Button>
                    </Upload>
                    
                    {previewImage && (
                      <div className="block -mt-3 flex-col items-end">
                        <img
                          src={previewImage}
                          alt="Thumbnail preview"
                          style={{ maxWidth: '100px', maxHeight: '60px', borderRadius: '6px' }}
                        />
                      </div>
                    )}
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  label={<Text className="text-gray-600">{t('descriptionLabel')}</Text>}
                  name="description"
                  rules={[
                    { required: true, message: t('descriptionRequired') },
                    { min: 10, message: t('descriptionMinLength') },
                  ]}
                >
                  <TextArea
                    rows={1}
                    placeholder={t('descriptionPlaceholder')}
                    size="middle"
                    className="rounded"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  label={<Text className="text-gray-600">{t('contentLabel')}</Text>}
                  name="content"
                  rules={[
                    { required: true, message: t('contentRequired') },
                    { min: 10, message: t('contentMinLength') },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder={t('contentPlaceholder')}
                    size="middle"
                    className="rounded"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="flex justify-end">
            <Space size="middle">
              <Button
                className="cancel-button border-gray-300 text-gray-600 hover:bg-gray-100 rounded"
                size="middle"
                icon={<CloseOutlined />}
                onClick={() => router.push('/admin/post')}
              >
                {t('cancelButton')}
              </Button>
              <Button
                className="submit-button bg-blue-600 hover:bg-blue-700 rounded"
                type="primary"
                htmlType="submit"
                loading={loading}
                size="middle"
                icon={<SaveOutlined />}
              >
                {id ? t('updateButton') : t('addButton')}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}