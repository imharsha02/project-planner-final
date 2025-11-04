import React from "react";
import { getProjects } from "@/app/lib/getProjects";
import AddStepsSection from "@/app/components/AddStepsSection";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const project = await getProjects();
  return (
    <>
      {/* Heading */}
      <div className="py-4">
        <h2 className="scroll-m-20 text-center tracking-wide text-3xl font-semibold">
          {project?.find((project) => project.id === id)?.project_name}
        </h2>
        <p className="text-center tracking-wide font-light">
          {project?.find((project) => project.id === id)?.project_description}
        </p>
      </div>

      {/* page content */}
      <AddStepsSection projectId={id} />
    </>
  );
};

export default Page;

// import React from "react";
// import { getProjects } from "@/app/lib/getProjects";
// import ProjectDetailsForm from "@/app/components/projectDetailsForm";
// const ProjectId = async ({ params }: { params: { id: string } }) => {
//   const { id } = params;
//   const projects = await getProjects();
//   const project = projects?.find((project) => project.id === id);
//   console.log(project);
//   return (
//     <div className="w-full">
//       {project && (
//         <div className="flex justify-between my-3 mx-auto w-7xl">
//           <div className="flex flex-col w-full">
//             <h2 className="pb-0 tracking-wide text-center text-3xl font-semibold">
//               {project.project_name}
//             </h2>
//             <p className="text-center tracking-wide font-light">
//               {project.project_description}
//             </p>
//           </div>

//           <div>
//             <ProjectDetailsForm
//               initialData={{
//                 department: project.department,
//                 project_name: project.project_name,
//                 start_date: project.start_date,
//                 end_date: project.end_date,
//                 project_description: project.project_description,
//               }}
//               buttonText="Update Project"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectId;
