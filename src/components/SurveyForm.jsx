"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner"; // Import Toaster and toast from Sonner
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Define the validation schema dynamically based on form fields
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  graduationYear: z.string().min(1, "Graduation year is required"),
  fye: z.array(z.string()).optional(),
  core: z.array(z.string()).optional(),
  communication: z.array(z.string()).optional(),
  mathematics: z.array(z.string()).optional(),
  science: z.array(z.string()).optional(),
  large_scale: z.array(z.string()).optional(),
});

export default function SignupForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fye: [],
      core: [],
      communication: [],
      mathematics: [],
      science: [],
      large_scale: [],
    },
  });

  const onSubmit = async (values) => {
    try {
      const formObject = {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: values.password,
        graduation: values.graduationYear,
        taken: {
          fye: {
            FYE100: values.fye.includes("FYE100") || false
          },
          core: {
            CSC141: values.core.includes("CSC141") || false,
            CSC142: values.core.includes("CSC142") || false,
            CSC220: values.core.includes("CSC220") || false,
            CSC231: values.core.includes("CSC231") || false,
            CSC240: values.core.includes("CSC240") || false,
            CSC241: values.core.includes("CSC241") || false,
            CSC301: values.core.includes("CSC301") || false,
            CSC345: values.core.includes("CSC345") || false,
            CSC402: values.core.includes("CSC402") || false,
          },
          communication: {
            ENG368: values.communication.includes("ENG368") || false,
            ENG371: values.communication.includes("ENG371") || false,
            SPK208: values.communication.includes("SPK208") || false,
            SPK230: values.communication.includes("SPK230") || false,
            SPK199: values.communication.includes("SPK199") || false
          },
          mathematics: {
            MAT121: values.mathematics.includes("MAT121") || false,
            MAT151: values.mathematics.includes("MAT151") || false,
            MAT161: values.mathematics.includes("MAT161") || false,
            MAT162: values.mathematics.includes("MAT162") || false,
            STA200: values.mathematics.includes("STA200") || false
          },
          science: {
            BIO110: values.science.includes("BIO110") || false,
            CHE103: values.science.includes("CHE103") || false,
            CRL103: values.science.includes("CRL103") || false,
            ESS101: values.science.includes("ESS101") || false,
            PHY130: values.science.includes("PHY130") || false,
            PHY170: values.science.includes("PHY170") || false
          },
          large_scale: {
            CSC416: values.large_scale.includes("CSC416") || false,
            CSC417: values.large_scale.includes("CSC417") || false,
            CSC418: values.large_scale.includes("CSC418") || false,
            CSC466: values.large_scale.includes("CSC466") || false,
            CSC467: values.large_scale.includes("CSC467") || false,
            CSC468: values.large_scale.includes("CSC468") || false,
            CSC476: values.large_scale.includes("CSC476") || false,
            CSC496: values.large_scale.includes("CSC496") || false
          }
        },
        requirements_satisfied: {
          fye: false,
          core: false,
          communication: false,
          mathematics: false,
          science: false,
          large_scale: false,
        },
        progress: {
          classes_completed: 0,
          total_credits: 0,
        },
        degree_completion: false,
      };


      const response = await fetch('http://localhost:3001/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
      });

      const data = await response.json();

      if (response.ok) {
        toast("Survey Submitted", {
          description: "Thank you for taking the survey!",
        });
      } else if (data.message) {
        // If the server returns a message (email exists)
        toast.error(data.message); // Show the error message
      } else {
        toast.error("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Email may be taken.");
    }
};


  const formFields = [
    {
      type: "text",
      name: "firstName",
      label: "First Name",
      placeholder: "Enter your first name",
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
      placeholder: "Enter your last name",
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
    },
    {
      type: "text",
      name: "graduationYear",
      label: "Graduation Year",
      placeholder: "Enter your graduation year",
    },
    {
      type: "checkbox",
      name: "fye",
      label: "Have you taken FYE? (select all that apply)",
      options: [
        { _id: "FYE100", name: "FYE100 - First-Year Experience" }
      ],
      validation: {
        required: "Select at least one FYE class"
      }
    },
    {
      type: "checkbox",
      name: "core",
      label: "Which of the core classes have you taken? (select all that apply)",
      options: [
        { _id: "CSC141", name: "CSC 141 - Computer Science I" },
        { _id: "CSC142", name: "CSC 142 - Computer Science II" },
        { _id: "CSC220", name: "CSC 220 - Foundations of Computer Science" },
        { _id: "CSC231", name: "CSC 231 - Computer Systems" },
        { _id: "CSC240", name: "CSC 240 - Computer Science III" },
        { _id: "CSC241", name: "CSC 241 - Data Structures and Algorithms" },
        { _id: "CSC301", name: "CSC 301 - Computer Security" },
        { _id: "CSC345", name: "CSC 345 - Programming Language Concepts and Paradigms" },
        { _id: "CSC402", name: "CSC 402 - Software Engineering" }
      ],
      validation: {
        required: "Select at least one core class"
      }
    },
    {
      type: "checkbox",
      name: "communication",
      label: "Which of these communication classes have you taken? (select all that apply)",
      options: [
        { _id: "ENG368", name: "ENG368 - Business and Organizational Writing" },
        { _id: "ENG371", name: "ENG371 - Technical Writing" },
        { _id: "SPK208", name: "SPK208 - Public Speaking" },
        { _id: "SPK230", name: "SPK230 - Business and Professional Speech Communication" },
        { _id: "SPK199", name: "SPK199 - Transfer Credit" }
      ],
      validation: {
        required: "Select at least one communication class"
      }
    },
    {
      type: "checkbox",
      name: "mathematics",
      label: "Which of these math classes have you taken? (select all that apply)",
      options: [
        { _id: "MAT121", name: "MAT121 - Statistics I" },
        { _id: "MAT151", name: "MAT151 - Introduction to Discrete Mathematics" },
        { _id: "MAT161", name: "MAT161 - Calculus I" },
        { _id: "MAT162", name: "MAT162 - Calculus II" },
        { _id: "STA200", name: "STA200 - Statistics II" }
      ],
      validation: {
        required: "Select at least one math class"
      }
    },
    {
      type: "checkbox",
      name: "science",
      label: "Which of these science & lab classes have you taken? (select all that apply)",
      options: [
        { _id: "BIO110", name: "BIO110 - General Biology" },
        { _id: "CHE103", name: "CHE103 - General Chemistry I" },
        { _id: "CRL103", name: "CRL103 - General Chemistry Lab" },
        { _id: "ESS101", name: "ESS101 - Introduction to Geology" },
        { _id: "PHY130", name: "PHY130 - General Physics I" },
        { _id: "PHY170", name: "PHY170 - Physics I" }
      ],
      validation: {
        required: "Select at least one science class"
      }
    },
    {
      type: "checkbox",
      name: "large_scale",
      label: "Which of these Large Complex Scale Classes have you taken? (select all that apply)",
      options: [
        { _id: "CSC416", name: "CSC416 - Design/Construction Compilers" },
        { _id: "CSC417", name: "CSC417 - User Interfaces" },
        { _id: "CSC418", name: "CSC418 - Modern Web Applications Using Server-Side Technologies" },
        { _id: "CSC466", name: "CSC466 - Distributed and Parallel Computing" },
        { _id: "CSC467", name: "CSC467 - Big Data Engineering" },
        { _id: "CSC468", name: "CSC468 - Introduction to Cloud Computing" },
        { _id: "CSC476", name: "CSC476 - Game Development" },
        { _id: "CSC496", name: "CSC496 - Topics in Complex Large-Scale Systems" }
      ],
      validation: {
        required: "Select at least one Large Complex Scale class"
      }
    }
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-10">
      <Toaster /> {/* Render the Toaster component to show the toasts */}

      <Card>
        <CardHeader>
          <CardTitle>CSDegreeNavigator Survey</CardTitle>
          <CardDescription>Help us to visualize your degree progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {formFields.map((field, index) => {
                switch (field.type) {
                  case "text":
                  case "email":
                  case "password":
                    return (
                      <FormField
                        key={index}
                        control={form.control}
                        name={field.name}
                        render={({ field: formField }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <input
                                type={field.type}
                                {...formField}
                                className="border p-2 w-full rounded-md"
                                placeholder={field.placeholder}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  case "checkbox":
                    return (
                      <FormField
                        key={index}
                        control={form.control}
                        name={field.name}
                        render={({ field: formField }) => (
                          <FormItem className="flex flex-col space-y-2">
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                {field.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center space-x-2">
                                    <Checkbox
                                      value={option._id}
                                      checked={formField.value?.includes(option._id)}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...formField.value, option._id]
                                          : formField.value.filter((item) => item !== option._id);
                                        formField.onChange(newValue);
                                      }}
                                    />
                                    <FormLabel>{option.name}</FormLabel>
                                  </div>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  default:
                    return null;
                }
              })}

              {/* Submit and Reset buttons */}
              <CardFooter className="flex justify-between mt-8">
                <Button type="reset" variant="outline">Reset</Button>
                <Button type="submit">Submit</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
