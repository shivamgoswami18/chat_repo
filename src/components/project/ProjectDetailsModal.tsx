"use client";
import React, { useEffect, useState, useRef } from "react";
import BaseModal from "../base/BaseModal";
import { CloseIcon } from "@/assets/icons/CommonIcons";
import BaseButton from "../base/BaseButton";
import BaseInput from "../base/BaseInput";
import { getTranslationSync } from "@/i18n/i18n";
import { ProjectCardProps } from "@/types/project";
import { inputPlaceHolder } from "../constants/Validation";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import { commonLabels, errorHandler } from "../constants/Common";
import BasicInformation from "./BasicInformation";
import BaseTabs from "../base/BaseTab";
import OfferCard from "@/components/project/OfferCard";
import {
  ViewProject,
  ApplyProjectOffer,
  UpdateProjectStatus,
  ListOfReceivedOffer,
} from "@/lib/api/ProjectApi";
import BaseLoader from "../base/BaseLoader";
import AddReviewModal from "./AddReviewModal";

const t = (key: string, params?: Record<string, string>) => {
  return getTranslationSync(key, params);
};
interface ProjectDetailsModalProps {
  visible: boolean;
  onHide: () => void;
  project: ProjectCardProps | null;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  visible,
  onHide,
  project,
}) => {
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    offerPrice: "",
    timeline: "",
    message: "",
  });
  const [showReviewModal, setShowReviewModal] = useState(false);

  const role = useAppSelector((state: RootState) => state.auth.role);
  const isLoading = useAppSelector(
    (state: RootState) => state.project.loadingProjectDetails
  );
  const currentProjectDetails = useAppSelector(
    (state: RootState) => state.project.currentProjectDetails
  );
  const offerItems = useAppSelector(
    (state: RootState) => state.project.receivedOffers?.items ?? []
  );
  const isSubmitting = useAppSelector((state: RootState) => state.auth.loading);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyNow = () => {
    if (currentProjectDetails?.offered) return;
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      offerPrice: "",
      timeline: "",
      message: "",
    });
  };

  const isBusinessRole = role === commonLabels?.businessRole;
  const isCustomerRole = role === commonLabels?.customerRole;

  const handleSubmit = () => {
    const amount = formData.offerPrice.trim()
      ? Number.parseFloat(formData.offerPrice)
      : 0;

    const payload = {
      customer_id: currentProjectDetails?.customer?._id ?? "",
      project_id: currentProjectDetails?._id ?? "",
      description: formData.message.trim() ?? "",
      estimated_duration: formData.timeline.trim() ?? "",
      amount: Number.isNaN(amount) ? 0 : amount ?? 0,
    };

    dispatch(ApplyProjectOffer({ payload }))
      .then(() => {
        setShowForm(false);
        setFormData({
          offerPrice: "",
          timeline: "",
          message: "",
        });
      })
      .catch((err) => {
        errorHandler(err);
      });
  };

  const handleUpdateProjectStatus = async () => {
    if (!project?._id || isSubmitting) return;

    await dispatch(
      UpdateProjectStatus({
        payload: {
          project_id: project._id,
          status: commonLabels.completedValue,
        },
      })
    );
    await dispatch(ViewProject(project._id));
    setShowReviewModal(true);
  };
  const [activeIndex, setActiveIndex] = useState(0);
  const prevActiveIndexRef = useRef<number>(0);
  const businessId = offerItems[0]?.business_id;

  useEffect(() => {
    if (!visible) {
      setShowForm(false);
      setFormData({
        offerPrice: "",
        timeline: "",
        message: "",
      });
      setActiveIndex(0);
      prevActiveIndexRef.current = 0;
    } else if (visible && project?._id) {
      dispatch(ViewProject(project._id));
    }
  }, [visible, project?._id, dispatch]);

  useEffect(() => {
    if (visible && project?._id && isCustomerRole) {
      dispatch(
        ListOfReceivedOffer({
          projectId: project._id,
          payload: {
            sortKey: "_id",
            sortValue: "desc",
            page: 1,
            limit: 10,
          },
        })
      );
    }
  }, [visible, project?._id, isCustomerRole, dispatch]);

  useEffect(() => {
    if (
      visible &&
      project?._id &&
      activeIndex === 0 &&
      prevActiveIndexRef.current !== 0 &&
      isCustomerRole
    ) {
      dispatch(ViewProject(project._id));
    }
    prevActiveIndexRef.current = activeIndex;
  }, [activeIndex, visible, project?._id, dispatch, isCustomerRole]);

  const renderFooter = () => {
    if (isCustomerRole) {
      const isCompleted =
        currentProjectDetails?.status === commonLabels.completedValue;
      return (
        <div className="flex justify-end">
          <BaseButton
            label={
              isCompleted
                ? t("myProjectsPageConstants.myProjectsCardCompleted")
                : t("projectDetailsPageConstants.statusCardButtonCompletedText")
            }
            onClick={handleUpdateProjectStatus}
            loader={isSubmitting}
            disabled={!isCompleted && !businessId}
            className="w-full sm:w-auto sm:min-w-[250px] py-[10px] px-[24px] bg-deepTeal border-none text-white rounded-[8px] text-textSm font-medium xl:leading-[100%] xl:tracking-[0px]"
          />
        </div>
      );
    }

    if (isBusinessRole) {
      const isOffered = currentProjectDetails?.offered === true;

      if (showForm && !isOffered) {
        return (
          <div className="flex gap-[12px] justify-between">
            <BaseButton
              label={t("projectDetailsPageConstants.cancel")}
              onClick={handleCancel}
              className="w-full sm:w-auto sm:min-w-[250px] py-[10px] px-[24px] bg-obsidianBlack bg-opacity-5 border-none text-obsidianBlack text-opacity-50 rounded-[8px] text-textSm font-medium xl:leading-[100%] xl:tracking-[0px]"
            />
            <BaseButton
              label={t("projectDetailsPageConstants.applyNow")}
              onClick={handleSubmit}
              loader={isSubmitting}
              className="w-full sm:w-auto sm:min-w-[250px] py-[10px] px-[24px] bg-deepTeal text-white border-none rounded-[8px] text-textSm font-medium xl:leading-[100%] xl:tracking-[0px]"
            />
          </div>
        );
      }
      return (
        <div className="flex justify-end">
          <BaseButton
            label={
              isOffered
                ? t("projectDetailsPageConstants.applied")
                : t("projectDetailsPageConstants.applyNow")
            }
            onClick={handleApplyNow}
            loader={isSubmitting}
            disabled={isOffered}
            className="w-full sm:w-auto sm:min-w-[250px] py-[10px] px-[24px] bg-deepTeal border-none text-white rounded-[8px] text-textSm font-medium xl:leading-[100%] xl:tracking-[0px]"
          />
        </div>
      );
    }

    return null;
  };

  if (!project) return null;

  const customerTabs = [
    {
      label: t("sidebarConstants.basicInformation"),
      component: <BasicInformation isCustomerRole={isCustomerRole} />,
    },
    {
      label: t("projectDetailsPageConstants.receivedOfferTitle"),
      component: <OfferCard />,
    },
  ];

  const labelClassName =
    "text-obsidianBlack text-textSm mb-[4px] xl:leading-[20px] xl:tracking-[0%]";
  const inputClassName =
    "font-light text-textBase px-[16px] text-obsidianBlack rounded-[8px] py-[12px] border border-lightGrayGamma focus:ring-0 placeholder:text-stoneGray placeholder:text-opacity-50 placeholder:text-textSm placeholder:font-light xl:placeholder:[line-height:20px] xl:placeholder:tracking-[0%] xl:leading-[20px] xl:tracking-[0%]";

  return (
    <>
      <BaseModal
        visible={visible}
        onHide={onHide}
        maxWidth="1000px"
        showCloseIcon={false}
        className="min-w-[280px] xxs:min-w-[350px] xs:min-w-[500px] sm:min-w-[600px] md:min-w-[750px] lg:min-w-[896px]"
        header={
          <div className="flex items-center justify-between p-[10px] sm:p-[20px] border-0 border-solid border-b border-graySoft border-opacity-50">
            <h2 className="text-obsidianBlack text-textBase sm:text-textLg font-light xl:leading-[100%] xl:tracking-[0px]">
              {t("projectDetailsPageConstants.projectNumberPrefix")}{" "}
              {project?._id?.slice(0, 5)}
            </h2>
            <BaseButton onClick={onHide} className="bg-transparent border-none">
              <CloseIcon className="text-obsidianBlack opacity-30" />
            </BaseButton>
          </div>
        }
        footer={
          <div className="w-full p-[10px] sm:p-[20px]">{renderFooter()}</div>
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-[40px] px-[20px]">
            <BaseLoader size="lg" />
          </div>
        ) : (
          <>
            {isBusinessRole && <BasicInformation />}

            {isCustomerRole && (
              <>
                <div className="pb-0 border-0 border-b border-solid border-graySoft border-opacity-50 bg-white p-[16px]">
                  <BaseTabs
                    tabs={customerTabs.map((t) => t.label)}
                    activeIndex={activeIndex}
                    onChange={setActiveIndex}
                    className="!text-start !items-start !justify-start"
                    tabClassName="with-no-padding"
                  />
                </div>
                <div className="">
                  {activeIndex === 0 ? (
                    <BasicInformation isCustomerRole={isCustomerRole} />
                  ) : (
                    customerTabs[activeIndex]?.component
                  )}
                </div>
              </>
            )}
            {showForm && isBusinessRole && !currentProjectDetails?.offered && (
              <div className="relative mt-[30px] pb-[24px] px-[20px]">
                <div className="absolute left-[-20px] right-[-20px] overflow-hidden bg-graySoft bg-opacity-50 h-[1px]" />
              </div>
            )}
            {showForm && isBusinessRole && !currentProjectDetails?.offered && (
              <div className="space-y-[14px] px-[20px]">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-[14px] sm:gap-[20px]">
                  <BaseInput
                    name="offerPrice"
                    label={t("projectDetailsPageConstants.offerPrice")}
                    value={formData.offerPrice}
                    onChange={handleInputChange}
                    placeholder={inputPlaceHolder(
                      t("projectDetailsPageConstants.offerPrice")
                    )}
                    labelClassName={labelClassName}
                    className={inputClassName}
                    type="number"
                    fullWidth
                  />
                  <BaseInput
                    name="timeline"
                    label={t("projectDetailsPageConstants.timeLine")}
                    value={formData.timeline}
                    onChange={handleInputChange}
                    placeholder={inputPlaceHolder(
                      t("projectDetailsPageConstants.timeLine")
                    )}
                    labelClassName={labelClassName}
                    className={`${inputClassName} pr-[50px]`}
                    type="number"
                    fullWidth
                    suffix={
                      Number(formData.timeline) > 1
                        ? t("projectDetailsPageConstants.daysSuffix")
                        : t("projectDetailsPageConstants.daySuffix")
                    }
                  />
                </div>
                <div>
                  <BaseInput
                    name="message"
                    label={t(
                      "settingsPageConstants.notificationsMessage.title"
                    )}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={inputPlaceHolder(
                      t("settingsPageConstants.notificationsMessage.title")
                    )}
                    labelClassName={labelClassName}
                    className={inputClassName}
                    type="textarea"
                    rows={4}
                    fullWidth
                  />
                </div>
              </div>
            )}
          </>
        )}
      </BaseModal>
      {isCustomerRole && showReviewModal && (
        <AddReviewModal
          visible={showReviewModal}
          onHide={() => setShowReviewModal(false)}
          projectId={project?._id}
          businessId={businessId}
        />
      )}
    </>
  );
};

export default ProjectDetailsModal;
