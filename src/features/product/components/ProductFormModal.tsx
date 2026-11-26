import { useState } from 'react';
import type { ProductItem, TypeProductInfo } from '../types/product.types';
import {
  AppForm,
  FormField,
  InputField,
  InputNumberField,
  UploadField,
  useForm,
} from '@/components/Form';
import {
  Button,
  Input,
  Modal,
  Select,
  type UploadFile,
  type UploadProps,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  DEFAULT_FORM_VALUES,
  formatProductPayload,
  useCategoryList,
} from '../services/product.services';
import { productYupSchema } from '../schemas/product.schemas';

interface Props {
  open: boolean;
  editingItem: ProductItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: TypeProductInfo) => void;
}
export default function ProductFormModal({
  open,
  editingItem,
  isSubmitting,
  onSubmit,
  onClose,
}: Props) {
  const [thumbnailFileList, setThumbnailFileList] = useState<UploadFile[]>(
    editingItem?.thumbnail
      ? [
          {
            uid: '-1',
            name: 'thumbnail.png',
            status: 'done',
            url: editingItem.thumbnail,
          },
        ]
      : []
  );

  const [imagesFileList, setImagesFileList] = useState<UploadFile[]>(() =>
    (editingItem?.images || []).map((url, idx) => ({
      uid: `-${idx + 2}`,
      name: `image-${idx + 1}.png`,
      status: 'done',
      url,
    }))
  );

  const [form] = useForm<TypeProductInfo>();
  const { categoryData, isLoading: isLoadingCategory } = useCategoryList();

  const handleCloseModal = () => {
    thumbnailFileList.forEach(file => {
      if (file.url?.startsWith('blob:')) URL.revokeObjectURL(file.url);
    });
    imagesFileList.forEach(file => {
      if (file.url?.startsWith('blob:')) URL.revokeObjectURL(file.url);
    });
    setImagesFileList([]);
    setThumbnailFileList([]);
    form.resetFields();
    onClose();
  };

  const handleThumbnailChange: UploadProps['onChange'] = ({ fileList }) => {
    const lastFile = fileList.slice(-1);
    if (lastFile.length > 0) {
      const file = lastFile[0];
      if (!file.url && file.originFileObj) {
        file.url = URL.createObjectURL(file.originFileObj);
      }
      setThumbnailFileList([file]);
      form.setFieldValue('thumbnail', file.url || '');
    } else {
      if (thumbnailFileList[0]?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailFileList[0].url);
      }
      setThumbnailFileList([]);
      form.setFieldValue('thumbnail', '');
    }
  };

  const handleImageChange: UploadProps['onChange'] = ({ fileList }) => {
    const updateList = fileList.map(file => {
      if (!file.url && file.originFileObj) {
        file.url = URL.createObjectURL(file.originFileObj);
      }
      return file;
    });
    setImagesFileList(updateList);
    const ImagesUrl = updateList
      .map(file => file.url)
      .filter((url): url is string => Boolean(url));
    form.setFieldValue('images', ImagesUrl);
  };

  const handleFinish = (data: TypeProductInfo) => {
    onSubmit(formatProductPayload(data));
  };
  return (
    <Modal
      open={open}
      title={editingItem ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
      width={800}
      onCancel={handleCloseModal}
      footer={null}
      forceRender
    >
      <AppForm
        form={form}
        onFinish={handleFinish}
        initialValues={
          editingItem ? formatProductPayload(editingItem) : DEFAULT_FORM_VALUES
        }
        schema={productYupSchema}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <FormField label="Tên sản phẩm" name="title">
            <InputField placeholder="Nhập tên sản phẩm" />
          </FormField>

          <FormField label="Danh mục" name="category">
            <Select
              placeholder="Chọn danh mục"
              loading={isLoadingCategory}
              options={categoryData.map(category => ({
                value: category,
                label: String(category).toUpperCase(),
              }))}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <FormField label="Thương hiệu (Brand)" name="brand">
            <InputField placeholder="Ví dụ: Apple, Samsung..." />
          </FormField>

          <FormField label="Mã SKU" name="sku">
            <InputField placeholder="Ví dụ: IP16-PM-256" />
          </FormField>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4">
          <FormField label="Giá ($)" name="price">
            <InputNumberField
              min={0}
              step={0.01}
              className="w-full"
              placeholder="0"
            />
          </FormField>

          <FormField label="Giảm giá (%)" name="discountPercentage">
            <InputNumberField
              min={0}
              max={100}
              className="w-full"
              placeholder="0"
            />
          </FormField>

          <FormField label="Tồn kho" name="stock">
            <InputNumberField min={0} className="w-full" placeholder="1" />
          </FormField>

          <FormField label="Đặt tối thiểu" name="minimumOrderQuantity">
            <InputNumberField min={1} className="w-full" placeholder="1" />
          </FormField>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4">
          <FormField label="Trọng lượng (g)" name="weight">
            <InputNumberField min={0} className="w-full" placeholder="0" />
          </FormField>

          <FormField label="Rộng (Width)" name={['dimensions', 'width']}>
            <InputNumberField min={0} className="w-full" placeholder="0" />
          </FormField>

          <FormField label="Cao (Height)" name={['dimensions', 'height']}>
            <InputNumberField min={0} className="w-full" placeholder="0" />
          </FormField>

          <FormField label="Sâu (Depth)" name={['dimensions', 'depth']}>
            <InputNumberField min={0} className="w-full" placeholder="0" />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
          <div className="md:col-span-2">
            <FormField
              label="Danh sách link ảnh (Images - Nhấn Enter sau mỗi link)"
              name="images"
            >
              <UploadField
                accept="image/*"
                beforeUpload={() => false}
                fileList={imagesFileList}
                onChange={handleImageChange}
                multiple
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Upload image</Button>
              </UploadField>
            </FormField>
          </div>

          <FormField label="Đánh giá (Rating)" name="rating">
            <InputNumberField
              min={0}
              max={5}
              step={0.1}
              className="w-full"
              placeholder="0 - 5"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <FormField label="Tags (Nhấn Enter để thêm)" name="tags">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Nhập tag rồi nhấn Enter"
              tokenSeparators={[',']}
            />
          </FormField>

          <FormField label="Ảnh đại diện (Thumbnail)" name="thumbnail">
            <UploadField
              accept="image/*"
              beforeUpload={() => false}
              fileList={thumbnailFileList}
              onChange={handleThumbnailChange}
              listType="picture"
              maxCount={1}
            >
              <Button type="default" icon={<UploadOutlined />}>
                Upload avatar
              </Button>
            </UploadField>
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
          <FormField label="Bảo hành" name="warrantyInformation">
            <InputField placeholder="Ví dụ: 1 year warranty" />
          </FormField>

          <FormField label="Vận chuyển" name="shippingInformation">
            <InputField placeholder="Ví dụ: Ships in 1-2 business days" />
          </FormField>

          <FormField label="Chính sách đổi trả" name="returnPolicy">
            <InputField placeholder="Ví dụ: 30 days return policy" />
          </FormField>
        </div>

        <FormField label="Mô tả sản phẩm" name="description">
          <Input.TextArea
            rows={3}
            placeholder="Nhập mô tả chi tiết sản phẩm..."
          />
        </FormField>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {editingItem ? 'Cập nhật' : 'Tạo'}
          </Button>
        </div>
      </AppForm>
    </Modal>
  );
}
