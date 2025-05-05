'use client';
import React, { useState } from 'react';
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Save,
  X,
  Send
} from 'lucide-react';

// Mock email templates
const initialTemplates = [
  {
    id: 1,
    name: 'Welcome Email',
    subject: 'Welcome to Shockwave Capital',
    body: `<p>Hello {{firstName}},</p>
<p>Welcome to Shockwave Capital! We're excited to have you join our trading community.</p>
<p>Your account has been created successfully and you can now log in to your dashboard to get started.</p>
<p>If you have any questions, feel free to reach out to our support team.</p>
<p>Best regards,<br>The Shockwave Capital Team</p>`,
    variables: ['firstName', 'lastName', 'email'],
    lastUpdated: '2023-05-25'
  },
  {
    id: 2,
    name: 'Order Confirmation',
    subject: 'Your Shockwave Capital Order Confirmation',
    body: `<p>Hello {{firstName}},</p>
<p>Thank you for your order with Shockwave Capital!</p>
<p>We're excited to confirm your {{challengeType}} purchase. Your order number is {{orderNumber}}.</p>
<p>Your login credentials will be sent to you shortly in a separate email.</p>
<p>If you have any questions about your order, please don't hesitate to contact us.</p>
<p>Best regards,<br>The Shockwave Capital Team</p>`,
    variables: ['firstName', 'lastName', 'email', 'challengeType', 'accountSize', 'orderNumber'],
    lastUpdated: '2023-05-24'
  },
  {
    id: 3,
    name: 'Login Credentials',
    subject: 'Your Shockwave Capital Trading Account Details',
    body: `<p>Hello {{firstName}},</p>
<p>Your Shockwave Capital trading account is ready!</p>
<p>Here are your login credentials:</p>
<p><strong>Platform:</strong> {{platform}}<br>
<strong>Login ID:</strong> {{loginId}}<br>
<strong>Password:</strong> {{password}}<br>
<strong>Server:</strong> {{server}}</p>
<p>Please change your password after your first login for security reasons.</p>
<p>Happy Trading!<br>The Shockwave Capital Team</p>`,
    variables: ['firstName', 'platform', 'loginId', 'password', 'server'],
    lastUpdated: '2023-05-23'
  }
];

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  lastUpdated: string;
}

interface TestValues {
  [key: string]: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [testValues, setTestValues] = useState<TestValues>({});
  
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    const newTemplate = {
      id: Date.now(),
      name: 'New Template',
      subject: 'New Email Subject',
      body: 'New Email Content',
      variables: [],
      lastUpdated: new Date().toISOString()
    };
    setCurrentTemplate(newTemplate);
    setIsEditing(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setCurrentTemplate(template);
    setIsEditing(true);
    setShowPreview(false);
    
    // Initialize test values
    const values: Record<string, string> = {};
    template.variables.forEach((variable: string) => {
      values[variable] = variable === 'firstName' ? 'John' : 
                         variable === 'lastName' ? 'Doe' : 
                         variable === 'email' ? 'john@example.com' :
                         variable === 'challengeType' ? 'Standard Challenge' :
                         variable === 'accountSize' ? '$10,000' :
                         variable === 'orderNumber' ? 'OSK1234' :
                         variable === 'platform' ? 'MT4' :
                         variable === 'loginId' ? '12345678' :
                         variable === 'password' ? 'Password123' :
                         variable === 'server' ? 'Shockwave-Live' :
                         `{{${variable}}}`;
    });
    setTestValues(values);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(template => template.id !== id));
    }
  };

  const handleSave = () => {
    if (!currentTemplate) return;
    
    const updatedTemplate = {
      ...currentTemplate,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    // If it's a new template, add it to the list
    if (templates.find(t => t.id === currentTemplate.id)) {
      setTemplates(templates.map(t => t.id === currentTemplate.id ? updatedTemplate : t));
    } else {
      setTemplates([...templates, updatedTemplate]);
    }
    
    setIsEditing(false);
    setCurrentTemplate(null);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentTemplate(null);
    setShowPreview(false);
  };
  
  const handlePreview = () => {
    if (!currentTemplate) return;
    setShowPreview(!showPreview);
  };
  
  const renderPreview = () => {
    if (!currentTemplate) return null;
    
    let previewSubject = currentTemplate.subject;
    let previewBody = currentTemplate.body;
    
    // Replace variables with test values
    Object.entries(testValues).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      previewSubject = previewSubject.replace(regex, value);
      previewBody = previewBody.replace(regex, value);
    });
    
    return (
      <div className="bg-[#151515] rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-white font-medium mb-2">Subject</h3>
          <div className="bg-[#0D0D0D] p-3 rounded text-white">{previewSubject}</div>
        </div>
        <div>
          <h3 className="text-white font-medium mb-2">Body</h3>
          <div 
            className="bg-[#0D0D0D] p-3 rounded text-white"
            dangerouslySetInnerHTML={{ __html: previewBody }}
          ></div>
        </div>
      </div>
    );
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (currentTemplate) {
      setCurrentTemplate({
        ...currentTemplate,
        [name]: value
      });
    }
  };
  
  const handleVariableAdd = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value && currentTemplate) {
      setCurrentTemplate({
        ...currentTemplate,
        variables: [...currentTemplate.variables, value]
      });
      e.target.value = '';
    }
  };

  const handleVariableRemove = (variable: string) => {
    if (currentTemplate) {
      setCurrentTemplate({
        ...currentTemplate,
        variables: currentTemplate.variables.filter((v: string) => v !== variable)
      });
      
      // Remove from test values
      const newTestValues = { ...testValues };
      delete newTestValues[variable];
      setTestValues(newTestValues);
    }
  };
  
  const handleTestValueChange = (variable: string, value: string) => {
    setTestValues({
      ...testValues,
      [variable]: value
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const value = target.value.trim();
      if (value && currentTemplate) {
        setCurrentTemplate({
          ...currentTemplate,
          variables: [...currentTemplate.variables, value]
        });
        target.value = '';
      }
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Email Templates</h1>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-[#0FF1CE] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0FF1CE]/90 transition-colors"
        >
          <Plus size={16} />
          <span>New Template</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className={`lg:col-span-1 ${isEditing ? 'hidden lg:block' : ''}`}>
          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
            <div className="relative mb-4">
              <input 
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
              />
            </div>
            
            <div className="space-y-3">
              {filteredTemplates.map(template => (
                <div 
                  key={template.id}
                  className="bg-[#151515] rounded-lg p-4 hover:border-[#0FF1CE]/30 transition-all border border-transparent cursor-pointer"
                  onClick={() => handleEdit(template)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium mb-1">{template.name}</h3>
                      <p className="text-gray-400 text-sm truncate">{template.subject}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        className="p-1 text-gray-400 hover:text-[#0FF1CE] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(template);
                        }}
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(template.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <div className="text-gray-500">Last updated: {template.lastUpdated}</div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Mail size={12} />
                      <span>{template.variables.length} variables</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8">
                  <Mail className="mx-auto text-gray-500 mb-2" size={24} />
                  <p className="text-gray-500">No templates found</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Template Editor */}
        {isEditing && currentTemplate && (
          <div className="lg:col-span-2">
            <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {currentTemplate.id === Date.now() ? 'Create New Template' : 'Edit Template'}
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePreview}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#151515] text-white text-sm hover:bg-[#2F2F2F] transition-colors"
                  >
                    <Send size={14} />
                    <span>{showPreview ? 'Edit' : 'Preview'}</span>
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0FF1CE] text-black text-sm hover:bg-[#0FF1CE]/90 transition-colors"
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#151515] text-white text-sm hover:bg-[#2F2F2F] transition-colors"
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
              
              {showPreview ? (
                <>
                  <h3 className="text-white font-medium mb-4">Email Preview</h3>
                  {renderPreview()}
                  
                  <div className="bg-[#151515] rounded-lg p-6">
                    <h3 className="text-white font-medium mb-4">Test Values</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentTemplate.variables.map((variable: string) => (
                        <div key={variable}>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            {variable}
                          </label>
                          <input
                            type="text"
                            value={testValues[variable] || ''}
                            onChange={(e) => handleTestValueChange(variable, e.target.value)}
                            className="w-full bg-[#0D0D0D] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={currentTemplate.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={currentTemplate.subject}
                      onChange={handleInputChange}
                      className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Body (HTML)
                    </label>
                    <textarea
                      name="body"
                      value={currentTemplate.body}
                      onChange={handleInputChange}
                      rows={10}
                      className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50 font-mono text-sm"
                    ></textarea>
                    <div className="text-xs text-gray-400 mt-1">
                      Use {'{{'} variableName {'}}'}  to insert dynamic content
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Variables
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {currentTemplate.variables.map((variable: string) => (
                        <div 
                          key={variable}
                          className="flex items-center gap-1 px-2 py-1 bg-[#0FF1CE]/20 text-[#0FF1CE] rounded-full text-xs"
                        >
                          <span>{variable}</span>
                          <button 
                            onClick={() => handleVariableRemove(variable)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      
                      {currentTemplate.variables.length === 0 && (
                        <div className="text-gray-500 text-sm">No variables added yet</div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a variable name"
                        onKeyDown={handleKeyDown}
                        onBlur={handleVariableAdd}
                        className="flex-1 bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                      />
                      <button 
                        onClick={() => document.querySelector('input[placeholder="Add a variable name"]')?.dispatchEvent(new Event('blur'))}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#151515] text-white hover:bg-[#2F2F2F] transition-colors"
                      >
                        <Plus size={14} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Empty state when no template is selected */}
        {!isEditing && (
          <div className="lg:col-span-2 hidden lg:flex items-center justify-center">
            <div className="text-center py-12">
              <Mail className="mx-auto text-gray-500 mb-4" size={32} />
              <h3 className="text-white font-medium mb-2">Select a template to edit</h3>
              <p className="text-gray-500 mb-4">Choose from the list or create a new template</p>
              <button 
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-[#0FF1CE] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0FF1CE]/90 transition-colors mx-auto"
              >
                <Plus size={16} />
                <span>New Template</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 